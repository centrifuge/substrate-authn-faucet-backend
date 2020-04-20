const config = require('../config/config');

const corsOptions = {
  origin: config.CFG_CORS_ORIGIN,
  credentials: true
};

export default corsOptions;
