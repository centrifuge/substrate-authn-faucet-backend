/**
 * Provides IP to Geolocation mapping services
 */

import {WebServiceClient} from '@maxmind/geoip2-node';
import * as Config from '../config/config';

export const getCountryFromIp = async (ip) => {
  if(ip == null || ip == undefined) throw new Error('IP must be defined');

  const client = new WebServiceClient(Config.CFG_MAXMIND_ACCOUNT_ID, Config.CFG_MAXMIND_LICENSE_KEY);

  // Note: You can get more IPs for testing/validation at https://free-proxy-list.net/.
  const response = await client.country(ip);
  return response.country.isoCode;
};

export const isValidCountry = (country) => {
  return Config.CFG_INVALID_COUNTRIES['' + country] == null;
};

export const checkIPForValidCountry = async (ip) => {
  const country = await getCountryFromIp(ip);
  return isValidCountry(country);
};