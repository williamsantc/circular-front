/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('funcionalidad', {
    func_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    func_descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    func_url: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
      tableName: 'funcionalidad'
    });
};
