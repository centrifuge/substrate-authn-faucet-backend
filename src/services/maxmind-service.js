/**
 * Provides IP to Geolocation mapping services
 */

import {WebServiceClient} from '@maxmind/geoip2-node';
import * as Config from '../config/config';
import * as ErrorStatus from '../constants/error-status';

export const getCountryFromIp = async (ip) => {
  if(ip == null || ip == undefined) throw new Error(ErrorStatus.INVALID_IP);

  const client = new WebServiceClient(Config.CFG_MAXMIND_ACCOUNT_ID, Config.CFG_MAXMIND_LICENSE_KEY);

  // Note: You can get more IPs for testing/validation at https://free-proxy-list.net/.
  // Response object as per https://dev.maxmind.com/geoip/geoip2/web-services/#Response_Body
  const response = await client.country(ip);
  const countryIsoCode = response.country.isoCode; // req is coming from this ip.
  const registedCountryIsoCode = response.registeredCountry.isoCode; // ip is registed in this country

  if(countryIsoCode != null) return countryIsoCode;
  if(registedCountryIsoCode != null) return registedCountryIsoCode;

  // if both iso codes are null
  throw new Error(ErrorStatus.INVALID_IP);
};

export const isValidCountry = (country) => {
  return Config.CFG_INVALID_COUNTRIES['' + country] == null;
};

export const checkIPForValidCountry = async (ip) => {
  const country = await getCountryFromIp(ip);
  return isValidCountry(country);
};