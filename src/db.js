const Sequelize = require('sequelize');
const Umzug = require('umzug');
const config = require('./config/config');

export const sequelize =
  process.env.NODE_ENV === 'production'
    ? new Sequelize(
        config.CFG_DB_NAME,
        config.CFG_DB_USER,
        config.CFG_DB_PASSWORD,
        {
          host: config.CFG_DB_HOST,
          dialect: config.CFG_DB_DIALECT,
          storage: config.CFG_DB_STORAGE_PATH,
          operatorsAliases: false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      )
    : new Sequelize(
        config.CFG_DB_NAME,
        config.CFG_DB_USER,
        config.CFG_DB_PASSWORD,
        {
          host: config.CFG_DB_HOST,
          dialect: config.CFG_DB_DIALECT,
          storage: config.CFG_DB_STORAGE_PATH,
          operatorsAliases: false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      );

const location = process.env.NODE_ENV == 'production' ? 'build/migrations' : 'migrations';

const runMigrations = async () => {
  try {
    console.log(new Date().toString(), 'running umzug migrations.');
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize // here should be a sequelize instance, not the Sequelize module
      },
      migrations: {
        params: [
          sequelize.getQueryInterface(),
          Sequelize // Sequelize constructor - the required module
        ],
        path: location.toString(),
        pattern: /\.js$/
      }
    });
    await umzug.up();
  } catch (e) {
    console.error(
      new Date().toString(),
      'Umzug migrations did not ran successfully ...',
      e
    );
    process.exit(1);
  }
};

runMigrations()
  .then(() => {
    sequelize.sync();
    console.log('umzug completed ..');
  })
  .catch(console.log);
