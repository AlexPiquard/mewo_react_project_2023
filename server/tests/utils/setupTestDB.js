const sequelize = require('../../src/config/database');

const setupTestDB = () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.truncate();
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
