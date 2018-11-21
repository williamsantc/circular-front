/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rol', {
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rol_descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'rol'
  });
};
