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
  name: 'alter-tables',
  created: '2020-04-16T22:26:41.821Z',
  comment: '',
};

const migrationCommands = [
  {
    fn: 'removeColumn',
    params: [
      'token_requests',
      'us_citizen',
      {},
    ],
  },
  {
    fn: 'addColumn',
    params: [
      'token_requests',
      'us_citizen',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false
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
