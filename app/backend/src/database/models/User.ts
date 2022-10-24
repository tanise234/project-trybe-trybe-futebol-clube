import { Model } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class Users extends Model {
    id: number;
    username: string;
    role: string;
    email: string;
    password: string;
  // declare <campo>: <tipo>;
}

Users.init({
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: STRING,
        allowNull: false,
    },
    role: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
  // ... Campos
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  // modelName: 'example',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS: 
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

// OtherModel.belongsTo(Users, { foreignKey: 'campoA', as: 'campoEstrangeiroA' });
// OtherModel.belongsTo(Users, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });

// Users.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Users.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default Users;
