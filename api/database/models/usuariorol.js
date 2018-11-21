/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuariorol', {
    usro_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usua_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'usua_id'
      }
    },
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'rol',
        key: 'rol_id'
      }
    }
  }, {
    tableName: 'usuariorol'
  });
};
