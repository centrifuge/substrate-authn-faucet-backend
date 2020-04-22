import * as errorStatus from '../constants/error-status';

export const getErrorMessageandCode = (error) => {
    let error_code;
    let error_message;
    switch (error.message) {
        case errorStatus.TOKEN_INVALID:
          error_code = 401;
          error_message =
            'Token is invalid or has expired. Please try logging in again.';
          break;
        case errorStatus.INVALID_COUNTRY:
          error_code = 422;
          error_message =
            'Radiant tokens are not available in your country. Please check back later.';
          break;
        case errorStatus.INVALID_PARAMETERS:
          error_code = 422;
          error_message = 'Required parameters are missing. Please try again.';
          break;
        case errorStatus.INVALID_GITHUB_ACCOUNT_AGE:
          error_code = 422;
          error_message = 'Your Github account should be 180 days older.';
          break;
        case errorStatus.INVALID_REQ_WITHIN_DELAY_PERIOD:
          error_code = 422;
          error_message = 'Request failed due to 24 hours check. Please check back later.';
          break;
        case errorStatus.INVALID_USER_COUNTRY:
          error_code = 422;
          error_message = 'Please provide correct country.';
          break;
        case errorStatus.INVALID_CHAIN_ADDRESS:
          error_code = 422;
          error_message = 'Please provide correct chain address.';
          break;
        case errorStatus.INVALID_TOC_PRIVACY:
          error_code = 422;
          error_message = 'Please agree on terms of service and privacy policy.';
          break;
        case errorStatus.OVERALL_LIMIT_REACHED:
          error_code = 422;
          error_message = 'Your overall account limit is reached. Please try again later.';
          break;
        case errorStatus.HOURLY_LIMIT_REACHED:
          error_code = 422;
          error_message = 'Faucet is dry, and we’re working to hydrate it. Please try again after an hour.';
          break;
        case errorStatus.DAILY_LIMIT_REACHED:
          error_code = 422;
          error_message = 'Faucet is dry, and we’re working to hydrate it. Please try again tomorrow.';
          break;
        case errorStatus.WEEKLY_LIMIT_REACHED:
          error_code = 422;
          error_message = 'Faucet is dry, and we’re working to hydrate it. Please try again next week.';
          break;
        default:
          error_code = 400;
          error_message = 'Something went wrong. Please try again later.';
          break;
      }
    return { error_code, error_message};
};