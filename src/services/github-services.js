import Config from '../config/config';
import axios from 'axios';

export const codeValidator = (code) => {
  if(code === null || code === '') throw new Error('Github code is empty');

};

/**
 * Returns Github User and information
 * Throws Error when required authencation fails.
 * @param {Github token} token
 */
export const getGithubUser = async (code) =>{

  codeValidator(code);

  const data = {
    client_id: Config.CFG_GITHUB_CLIENT_ID,
    client_secret: Config.CFG_GITHUB_SECRET,
    code
  };
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json'
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url: 'https://github.com/login/oauth/access_token'
  };

  const response = await axios.request(options);

  if (!response.data) throw new Error('TOKEN_INVALID');
  if (!response.data.access_token) throw new Error('TOKEN_INVALID');

  // console.log('Response data', response.data);

  const { access_token: accessToken } = response.data;

  const userResponse = await axios.get(' https://api.github.com/user',
  {
    headers : { ...headers, Authorization : `token ${accessToken}`}
  }
  );

  if (!userResponse.data) throw new Error('TOKEN_INVALID');

  return userResponse.data;
};

export const checkGithubAccountAge = (accountCreatedAt) => {
  if(accountCreatedAt === null || accountCreatedAt === '') throw new Error('INVALID_TIMESTAMP');
  const currentTimeStamp = new Date();
  const accountCreatedAtTimeStamp = new Date(accountCreatedAt);
  const minAccountAgeInDays = Config.CFG_GITHUB_ACCOUNT_AGE * 24;
  const githubAccountAgeInDays = (currentTimeStamp.getTime() - accountCreatedAtTimeStamp.getTime()) / (1000*3600) ;
  return githubAccountAgeInDays > minAccountAgeInDays;
};


export const userReqAfterGithubAccountAge = async (user) => {
  const validAccount = await checkGithubAccountAge(user.created_at);
  return validAccount;
};
