module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('teams', {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        teamName: {
          type: Sequelize.STRING,
        }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('teams');
    },
  };
  