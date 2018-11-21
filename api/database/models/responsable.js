/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('responsable', {
    resp_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    resp_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    resp_cargo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'responsable'
  });
};
