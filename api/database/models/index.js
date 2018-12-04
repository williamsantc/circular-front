'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.circular.belongsTo(db.area, { foreignKey: 'area_id', as: 'area' });
db.area.hasOne(db.circular, { foreignKey: 'area_id', as: 'area' });

db.circular.belongsTo(db.responsable, { foreignKey: 'resp_id', as: 'responsable' });
db.responsable.hasOne(db.circular, { foreignKey: 'resp_id', as: 'responsable' });

db.circular.belongsTo(db.entidad, { foreignKey: 'enti_id', as: 'entidad' });
db.entidad.hasOne(db.circular, { foreignKey: 'enti_id', as: 'entidad' });

db.almacenar.belongsTo(db.circular, { foreignKey: 'circ_id', as: 'circular' });
db.circular.hasOne(db.almacenar, { foreignKey: 'circ_id', as: 'circular' });

db.usuario.belongsToMany(db.rol, {
  through: {
    model: db.usuariorol,
    unique: false
  }, foreignKey: 'usua_id', as: 'rol'
});

db.rol.belongsToMany(db.usuario, {
  through: {
    model: db.usuariorol,
    unique: false
  }, foreignKey: 'rol_id', as: 'usuario'
});

db.rol.belongsToMany(db.funcionalidad, {
  through: {
    model: db.rolfuncionalidad,
    unique: false
  }, foreignKey: 'rol_id', as: 'funcionalidad'
});

db.funcionalidad.belongsToMany(db.rol, {
  through: {
    model: db.rolfuncionalidad,
    unique: false
  }, foreignKey: 'func_id', as: 'rol'
});

db.funcionalidad.belongsTo(db.funcionalidad, { foreignKey: 'func_padre', as: 'padre'});
db.funcionalidad.hasMany(db.funcionalidad, { foreignKey: 'func_padre', as: 'hijas'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

module.exports = db;
