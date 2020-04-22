import { BN } from 'bn.js';
import { Users, TokenRequests } from '../models';
import Config from '../config/config';
import * as ErrorStatus from '../constants/error-status';

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

export const checkHourDayWeakLimit = async () => {
  try{
      const TokenRequest = await TokenRequests.findAll({
        raw : true 
      });
      let result = { day: {}, hourly: {}, weekly: {}};
      TokenRequest.map(req=> {
        const dayhour = getDateHour(req.createdAt);
        if(result.hourly[dayhour] === undefined) {
          result.hourly[dayhour] = 1;
        }
        else {
          result.hourly[dayhour] = result.hourly[dayhour] + 1;
        }

        const day = getDay(req.createdAt);
        if(result.day[day] === undefined) {
          result.day[day] = 1;
        }
        else {
          result.day[day] = result.day[day] + 1;
        }
      });
      console.log(result);
    }
    catch(ex) {
      console.log(ex);
      throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);
    }
};
