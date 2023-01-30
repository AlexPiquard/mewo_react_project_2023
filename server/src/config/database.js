const Sequelize = require('sequelize');
const config = require('./config');
const logger = require('./logger');

const sequelize = new Sequelize({
  dialect: config.sequelize.dialect,
  storage: config.sequelize.storage,
  logging: (msg) => logger.debug(msg),
});

module.exports = sequelize;
