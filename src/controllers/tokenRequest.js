import * as Centrifuge from '../services/centrifuge-service';
import * as GithubServices from '../services/github-services';
import * as UserService from '../services/user-service';
import * as TokenLimitService from '../services/token-limit-service';
// import { PQueue } from 'p-queue';
import { checkIPForValidCountry } from '../services/maxmind-service';
import { getErrorMessageandCode } from '../services/error-service';
import * as ErrorStatus from '../constants/error-status';

const extractToken = (authorizationHeader) => {
  const bearer_pattern = /^Bearer\s([a-f0-9-]*)$/i;
  const authorization_match = authorizationHeader.match(bearer_pattern);
  if (!authorization_match) throw new Error('TOKEN_INVALID');
  const githubToken = authorization_match[1];

  return githubToken;
};

export const healthCheck = async (req,res) => {
  try {
    const balance = await Centrifuge.walletBalance();
    res.status(200).json(balance);
  }catch(error){
    res.status(500).json('Something went wrong', error);
  }
};

export const requestTokens = async (req, res) => {
  try {

    const github_token = extractToken(req.headers.authorization);
    const {
      'full_name' : userFullName,
      'email': userEmail,
      'company_name' : userCompany,
      'country' : userCountry,
      'us_citizen' : isUsCitizen,
      'address' : address,
      'toc_and_privacy' : isTocPrivacy,
      'auth_type' : authType
    } = req.body;
    var ipAddress = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
    if(userCountry === null || userCountry === '') throw new Error(ErrorStatus.INVALID_USER_COUNTRY);
    if(isUsCitizen === null || isUsCitizen === true || userCountry === 'US') throw new Error(ErrorStatus.INVALID_COUNTRY);
    if(address === null || address === '') throw new Error(ErrorStatus.INVALID_CHAIN_ADDRESS);
    if(isTocPrivacy === null || isTocPrivacy === false) throw new Error(ErrorStatus.INVALID_TOC_PRIVACY);
    if(authType === null || authType === '' || !authType == 'github') throw new Error(ErrorStatus.INVAID_AUTH_TYPE);
    if(ipAddress === null || ipAddress === '' || ipAddress.startsWith('192') ) throw new Error(ErrorStatus.INVALID_IP_ADDRESS);

    const githubUser = await GithubServices.getGithubUser(github_token);

    const isGithubAccountAgeValid = await GithubServices.userReqAfterGithubAccountAge(githubUser);
    if(!isGithubAccountAgeValid) throw new Error(ErrorStatus.INVALID_GITHUB_ACCOUNT_AGE);

    const user = await UserService.getCentrifugeUser(githubUser);
    const isUserReqAfterAllowedDelay = await UserService.userReqAfterAllowedDelay(user);
    if(!isUserReqAfterAllowedDelay) throw new Error(ErrorStatus.INVALID_REQ_WITHIN_DELAY_PERIOD);

    const isOverAllLimitReached = await TokenLimitService.checkOverallTokenLimit(user);
    if(!isOverAllLimitReached) throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);

    const isValidCountry = await checkIPForValidCountry(ipAddress);
    if(!isValidCountry) throw new Error(ErrorStatus.INVALID_COUNTRY);

    const isValidHourDayWeekLimit = await TokenLimitService.checkHourDayWeakLimit();
    if(!isValidHourDayWeekLimit) throw new Error(ErrorStatus.OVERALL_LIMIT_REACHED);

    console.log('Recipient address : ', address);
    const txHash = await Centrifuge.transfer(address);

    await UserService.updateUserTimeStamp(user);

    await UserService.logTokenRequest(user, {
      userFullName,
      userEmail,
      userCompany,
      userCountry,
      isUsCitizen,
      address,
      ipAddress,
      txHash: txHash.toString()
    });

    const out = {
      message: 'Coins are successfully transferred to your address.',
      tx_hash: txHash
    };
    return res.status(200).json(out);
  } catch (error) {
    console.log('Error while processing request ', error);
    const { error_code, error_message} = getErrorMessageandCode(error);
    return res.status(error_code).json({
      message: error_message
    });
  }
};