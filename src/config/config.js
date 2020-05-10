const vars = {
  development: {
    DB_NAME: 'database_test',
    DB_HOST: 'localhost',
    DB_USER: 'sqlite',
    DB_DIALECT: 'sqlite',
    DB_STORAGE_PATH: '../database_test.sqlite',
    CORS_ORIGIN: '*',
    GITHUB_CLIENT_ID: '9dffefab6a7f7cfd1efb',
    NETOWRK_URL:'wss://fullnode.amber.centrifuge.io',
    TRANSFER_AMOUNT:'100000000000000',
    MAXMIND_ACCOUNT_ID : '000000',
    INVALID_COUNTRIES : {
      'US' :{
        'COUNTRY': 'United States',
        'ISO': 'US'
      }
    },
    REQUEST_DELAY: 24, // request age after which token req allowed
    GITHUB_ACCOUNT_AGE: 180, // github account age in days
    ACCOUNT_TOKEN_LIMIT: '1000000000000000',
    HOURLY_LIMIT: '300000000000000',
    DAILY_LIMIT: '500000000000000',
    WEEKLY_LIMIT: '1000000000000000'
  },
  amber: {
    DB_NAME: 'sqlite',
    DB_HOST: 'localhost',
    DB_USER: 'sqlite',
    DB_DIALECT: 'sqlite',
    DB_STORAGE_PATH: '/data/centrifgue.db',
    CORS_ORIGIN: ['https://amber.faucet.chain.centrifuge.io'],
    GITHUB_CLIENT_ID: '',
    NETOWRK_URL:'wss://fullnode.amber.centrifuge.io',
    TRANSFER_AMOUNT:'100000000000000000',
    MAXMIND_ACCOUNT_ID : '000000',
    INVALID_COUNTRIES : {
      'US' : 'United States'
    },
    REQUEST_DELAY: 24, // request delay after which token req allowed
    GITHUB_ACCOUNT_AGE: 180, // github account age in days
    ACCOUNT_TOKEN_LIMIT: '10000000000000000000',
    HOURLY_LIMIT: '10000000000000000000000',
    DAILY_LIMIT: '10000000000000000000000',
    WEEKLY_LIMIT: '100000000000000000000000'
  }
};

// calculate effective variables
const effVars = process.env.NODE_ENV === undefined ? vars.development : vars[process.env.NODE_ENV];

const CFG_CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : effVars.CORS_ORIGIN;

const CFG_DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : effVars.DB_NAME;

const CFG_DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : effVars.DB_HOST;

const CFG_DB_USER = process.env.DB_USER ? process.env.DB_USER : effVars.DB_USER;

const CFG_DB_DIALECT = process.env.DB_DIALECT ? process.env.DB_DIALECT : effVars.DB_DIALECT;

const CFG_DB_PASSWORD = process.env.DB_PASSWORD;

const CFG_HOT_WALLET_SEED = process.env.HOT_WALLET_SEED;

const CFG_GITHUB_SECRET = process.env.GITHUB_SECRET;

const CFG_GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID : effVars.GITHUB_CLIENT_ID;

const CFG_NETOWRK_URL = process.env.NETOWRK_URL ? process.env.NETOWRK_URL : effVars.NETOWRK_URL;

const CFG_TRANSFER_AMOUNT = process.env.TRANSFER_AMOUNT ? process.env.TRANSFER_AMOUNT : effVars.TRANSFER_AMOUNT;

const CFG_SECRET = process.env.JWT_SECRET || 'S3cret';

const CFG_SESSION_TIMEOUT = 1800; // in seconds

const CFG_MAXMIND_ACCOUNT_ID = process.env.MAXMIND_ACCOUNT_ID ? process.env.MAXMIND_ACCOUNT_ID : effVars.MAXMIND_ACCOUNT_ID;

const CFG_MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY;

const CFG_INVALID_COUNTRIES = effVars.INVALID_COUNTRIES;

const CFG_DB_STORAGE_PATH = process.env.DB_STORAGE_PATH ? process.env.DB_STORAGE_PATH : effVars.DB_STORAGE_PATH;

const CFG_REQUEST_DELAY = process.env.REQUEST_DELAY ? process.env.REQUEST_DELAY : effVars.REQUEST_DELAY;

const CFG_GITHUB_ACCOUNT_AGE = process.env.GITHUB_ACCOUNT_AGE ? process.env.GITHUB_ACCOUNT_AGE : effVars.GITHUB_ACCOUNT_AGE;

const CFG_ACCOUNT_TOKEN_LIMIT = process.env.ACCOUNT_TOKEN_LIMIT ? process.env.ACCOUNT_TOKEN_LIMIT : effVars.ACCOUNT_TOKEN_LIMIT;

const CFG_HOURLY_LIMIT = process.env.HOURLY_LIMIT ? process.env.HOURLY_LIMIT : effVars.HOURLY_LIMIT;
const CFG_DAILY_LIMIT = process.env.DAILY_LIMIT ? process.env.DAILY_LIMIT : effVars.DAILY_LIMIT;
const CFG_WEEKLY_LIMIT = process.env.WEEKLY_LIMIT ? process.env.WEEKLY_LIMIT : effVars.WEEKLY_LIMIT;

module.exports = {
  CFG_DB_NAME,
  CFG_DB_HOST,
  CFG_DB_DIALECT,
  CFG_DB_PASSWORD,
  CFG_DB_USER,
  CFG_DB_STORAGE_PATH,
  CFG_SECRET,
  CFG_SESSION_TIMEOUT,
  CFG_CORS_ORIGIN,
  CFG_HOT_WALLET_SEED,
  CFG_GITHUB_SECRET,
  CFG_GITHUB_CLIENT_ID,
  CFG_NETOWRK_URL,
  CFG_TRANSFER_AMOUNT,
  CFG_MAXMIND_ACCOUNT_ID,
  CFG_MAXMIND_LICENSE_KEY,
  CFG_INVALID_COUNTRIES,
  CFG_REQUEST_DELAY,
  CFG_GITHUB_ACCOUNT_AGE,
  CFG_ACCOUNT_TOKEN_LIMIT,
  CFG_DAILY_LIMIT,
  CFG_HOURLY_LIMIT,
  CFG_WEEKLY_LIMIT
};
