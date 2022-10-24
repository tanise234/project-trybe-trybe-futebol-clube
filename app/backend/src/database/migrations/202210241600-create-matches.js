module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('matches', {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        homeTeam: {
          type: Sequelize.INTEGER,
        },
        homeTeamGoals: {
          type: Sequelize.INTEGER,
        },
        awayTeam: {
          type: Sequelize.INTEGER,
        },
        awayTeamGoals: {
          type: Sequelize.INTEGER,
        },
        inProgress: {
          type: Sequelize.INTEGER,
        }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('matches');
    },
  };
  