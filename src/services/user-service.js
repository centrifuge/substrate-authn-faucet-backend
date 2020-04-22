import { BN } from 'bn.js';
import { Users, TokenRequests } from '../models';
import Config from '../config/config';
import * as ErrorStatus from '../constants/error-status';
let hourDayWeekData = { day: {}, hourly: {}, weekly: {}};

export const getCentrifugeUser = async (githubUser) => {
  try{
    const [ user, created ] = await Users.findOrCreate({
        where : {githubUserName: githubUser.login},
        defaults: {
          githubUserName: githubUser.login
      }});
      return {
        centrifugeUser : {
          lastRequestTime: user.lastRequestTime,
          uuid: user.uuid,
          created
        },
        githubUser
      };
    }
    catch(ex) {
      throw new Error('INVALID_USER');
    }
};

export const isReqAfterAllowedDelay = (timestampStr) => {
  if(timestampStr === null || timestampStr === '') throw new Error('INVALID_TIMESTAMP');
  const currentTimeStamp = new Date();
  const timestamp = new Date(timestampStr);
  const reqDelay = Config.CFG_REQUEST_DELAY * 3600;
  const durationBetweenReq = (currentTimeStamp.getTime() - timestamp.getTime()) / 1000;
  return reqDelay < durationBetweenReq;
};

export const updateUserTimeStamp = async (centrifugeUser) => {
  if(centrifugeUser === null || centrifugeUser === '') throw new Error('INVALID_USER');
  try{
    const currentTime = new Date();
    await Users.update({ lastRequestTime: currentTime }, {
        where : {
          githubUserName: centrifugeUser.githubUser.login,
          uuid: centrifugeUser.centrifugeUser.uuid
        }
      });
      return true;
  }
  catch(ex) {
    throw new Error('INVALID_USER');
  }
};

export const userReqAfterAllowedDelay = async (user) => {
  if(user.centrifugeUser.created || user.centrifugeUser.lastRequestTime === null) return true; // if we just created the user
  const validRequest = await isReqAfterAllowedDelay(user.centrifugeUser.lastRequestTime);
  return validRequest;
};

export const logTokenRequest = async (centrifugeUser, tokenDetails) => {
  try{
      const transferAmount = Config.CFG_TRANSFER_AMOUNT;
      await TokenRequests.create({
        user_uuid: centrifugeUser.centrifugeUser.uuid,
        fullName: tokenDetails.userFullName,
        email: tokenDetails.userEmail,
        company: tokenDetails.userCompany,
        countryInput: tokenDetails.userCountry,
        countryIp: tokenDetails.ipAddress,
        usCitizen: tokenDetails.isUsCitizen,
        chainAddress: tokenDetails.address,
        txAmount: transferAmount,
        txHash: tokenDetails.txHash,
        completed: true
      });
      updateHourDayWeakData(new Date());
      return true;
    }
    catch(ex) {
      throw new Error('INVALID_TOKEN_REQUEST');
    }
};

export const checkOverallTokenLimit = async (centrifugeUser) => {
  try{
    const accountTokenLimit = Config.CFG_ACCOUNT_TOKEN_LIMIT;
    const TokenRequest = await TokenRequests.findAll({
        where : { user_uuid: centrifugeUser.centrifugeUser.uuid },
        raw : true 
        });
      let totalValue;
      TokenRequest.map(req => {
        totalValue = new BN(totalValue).add(new BN(req.txAmount));
      });
      if(totalValue.gt(new BN(accountTokenLimit))) 
        return false;
      return true;
    }
    catch(ex) {
      throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);
    }
};

const getDateHour = (createdAt) => {
  const day = new Date(createdAt);
  return day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' ' + day.getHours() + ':00:00';
};

const getDay = (createdAt) => {
  const day = new Date(createdAt);
  return day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' 00:00:00';
};

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

const getWeekNo = (createdAt) => {
  const day = new Date(createdAt);
  var result = getWeekNumber(day);
  return result[1] + '-' + result[0];
};

export const updateHourDayWeakData = (createdAt) => {
  const dayhour = getDateHour(createdAt);
  const transferAmount = Config.CFG_TRANSFER_AMOUNT;
  if(hourDayWeekData.hourly[dayhour] === undefined) {
    hourDayWeekData.hourly[dayhour] = new BN(transferAmount);
  }
  else {
    hourDayWeekData.hourly[dayhour] = new BN(hourDayWeekData.hourly[dayhour]).add(new BN(transferAmount));
  }

  const day = getDay(createdAt);
  if(hourDayWeekData.day[day] === undefined) {
    hourDayWeekData.day[day] = new BN(transferAmount);
  }
  else {
    hourDayWeekData.day[day] = new BN(hourDayWeekData.day[day]).add(new BN(transferAmount));
  }

  const weekNo = getWeekNo(createdAt);
  if(hourDayWeekData.weekly[weekNo] === undefined) {
    hourDayWeekData.weekly[weekNo] = new BN(transferAmount);
  }
  else {
    hourDayWeekData.weekly[weekNo] = new BN(hourDayWeekData.weekly[weekNo]).add(new BN(transferAmount));
  }
};

export const checkHourDayWeakLimit = async () => {
  const hourlyLimit = Config.CFG_HOURLY_LIMIT;
  const dailyLimit = Config.CFG_DAILY_LIMIT;
  const weeklyLimit = Config.CFG_WEEKLY_LIMIT;
  const reqDate = new Date();
  const dayHour = getDateHour(reqDate);
  if(new BN(hourDayWeekData.hourly[dayHour]).gte(new BN(hourlyLimit))) {
    throw new Error(ErrorStatus.HOURLY_LIMIT_REACHED);
  }
  const day = getDay(reqDate);
  if(new BN(hourDayWeekData.day[day]).gte(new BN(dailyLimit))) {
    throw new Error(ErrorStatus.DAILY_LIMIT_REACHED);
  }
  const weekNo = getWeekNo(reqDate);
  if(new BN(hourDayWeekData.weekly[weekNo]).gte(new BN(weeklyLimit))) {
    throw new Error(ErrorStatus.WEEKLY_LIMIT_REACHED);
  }
  return true;
};

export const prepareHourDayWeakLimitData = async () => {
  try{
      const TokenRequest = await TokenRequests.findAll({
        raw : true 
      });
      TokenRequest.map(req=> {
        updateHourDayWeakData(req.createdAt);
      });
    }
    catch(ex) {
      throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);
    }
};
