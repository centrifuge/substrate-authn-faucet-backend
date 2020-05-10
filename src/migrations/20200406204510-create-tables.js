/* eslint-disable*/
'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "users", deps: []
 *
 **/

var info = {
  revision: 1,
  name: 'create-tables',
  created: '2019-06-10T22:26:41.821Z',
  comment: '',
};

var migrationCommands = [
  {
    fn: 'createTable',
    params: [
      'users',
      {
        uuid: {
          type: Sequelize.UUID,
          field: 'uuid',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV1,
        },
        githubUserName: {
          type: Sequelize.TEXT,
          field: 'github_user_name',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at',
          allowNull: false,
        },
        lastRequestTime: {
          type: Sequelize.DATE,
          field: 'last_request_time',
          allowNull: false,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'token_requests',
      {
        uuid: {
          type: Sequelize.UUID,
          field: 'uuid',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV1,
        },
        useruuid: {
          type: Sequelize.UUID,
          field: 'user_uuid',
        },
        fullName: {
          type: Sequelize.TEXT,
          field: 'full_name',
        },
        email: {
          type: Sequelize.TEXT,
          field: 'email',
        },
        company: {
          type: Sequelize.TEXT,
          field: 'company',
        },
        countryInput: {
          type: Sequelize.TEXT,
          field: 'country_input',
        },
        countryIp: {
          type: Sequelize.TEXT,
          field: 'country_ip',
        },
        usCitizen: {
          type: Sequelize.TEXT,
          field: 'us_citizen',
        },
        chainAddress: {
          type: Sequelize.TEXT,
          field: 'chain_address',
        },
        txAmount: {
          type: Sequelize.TEXT,
          field: 'tx_amount',
        },
        txHash: {
          type: Sequelize.TEXT,
          field: 'tx_hash',
        },
        completed: {
          type: Sequelize.BOOLEAN,
          field: 'completed',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at',
          allowNull: false,
        },
      },
      {},
    ],
  },
];

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }
      next();
    });
  },
  info: info,
};
