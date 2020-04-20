import { Users, TokenRequests } from '../models';
import Config from '../config/config';

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