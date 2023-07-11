const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Digpiy@sql', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
