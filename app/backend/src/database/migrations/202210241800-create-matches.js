module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('matches', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        home_team: {
          type: Sequelize.INTEGER,
          references: {
            model: 'teams',
            key: 'id',
          }
        },
        home_team_goals: {
          type: Sequelize.INTEGER,
        },
        away_team: {
          type: Sequelize.INTEGER,
          references: {
            model: 'teams',
            key: 'id',
          }
        },
        away_team_goals: {
          type: Sequelize.INTEGER,
        },
        in_progress: {
          type: Sequelize.INTEGER,
        }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('matches');
    },
  };
  