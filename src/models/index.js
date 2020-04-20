const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const config = require('../config/config');

const db = {};

const sequelize = new Sequelize(
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

// const sequelize = new Sequelize({
//   // The `host` parameter is required for other databases
//   // host: 'localhost'
//   dialect: 'sqlite',
//   storage: '/Users/zadkiel/sqlite3/database.sqlite'
// });

// var sequelize = new Sequelize('sqlite:file.sqlite');
// sequelize.sync();


fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
