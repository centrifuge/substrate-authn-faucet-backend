import { BN } from 'bn.js';
import { TokenRequests } from '../models';
import Config from '../config/config';
import * as ErrorStatus from '../constants/error-status';
import { getDateHour, getDay, getWeekNo } from '../utils/helper';
let hourDayWeekData = { daily: {}, hourly: {}, weekly: {}};
let initiated = false;

export const checkOverallTokenLimit = async (centrifugeUser) => {
    try{
        const accountTokenLimit = Config.CFG_ACCOUNT_TOKEN_LIMIT;
        const TokenRequest = await TokenRequests.findAll({
          where : { user_uuid: centrifugeUser.centrifugeUser.uuid },
          raw : true
        });
        let totalValue = new BN('0');
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

export const updateHourDayWeakData = (createdAt) => {
    const dayhour = getDateHour(createdAt);
    const transferAmount = Config.CFG_TRANSFER_AMOUNT;
    if(hourDayWeekData.hourly[dayhour] == undefined) {
      hourDayWeekData.hourly[dayhour] = new BN(transferAmount);
    }
    else {
      hourDayWeekData.hourly[dayhour] = new BN(hourDayWeekData.hourly[dayhour]).add(new BN(transferAmount));
    }

    const day = getDay(createdAt);
    if(hourDayWeekData.daily[day] == undefined) {
      hourDayWeekData.daily[day] = new BN(transferAmount);
    }
    else {
      hourDayWeekData.daily[day] = new BN(hourDayWeekData.daily[day]).add(new BN(transferAmount));
    }

    const weekNo = getWeekNo(createdAt);
    if(hourDayWeekData.weekly[weekNo] == undefined) {
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
    if(!initiated) throw new Error(ErrorStatus.HOUR_DAY_WEEK_DATA_NOT_PREPARED);

    if(hourDayWeekData.daily == undefined && hourDayWeekData.hourly == undefined && hourDayWeekData.weekly == undefined) {
      return true;
    }

    const dayHour = getDateHour(reqDate);
    if(new BN(hourDayWeekData.hourly[dayHour]).gte(new BN(hourlyLimit))) {
      throw new Error(ErrorStatus.HOURLY_LIMIT_REACHED);
    }
    const day = getDay(reqDate);
    if(new BN(hourDayWeekData.daily[day]).gte(new BN(dailyLimit))) {
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
        const tokenRequests = await TokenRequests.findAll({
          raw : true
        });
        tokenRequests.map(req=> {
          updateHourDayWeakData(req.createdAt);
        });
        console.log(hourDayWeekData);
        initiated = true;
    }
    catch(ex) {
        throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);
    }
};

prepareHourDayWeakLimitData();