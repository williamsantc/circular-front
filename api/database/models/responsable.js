/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('responsable', {
    resp_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    resp_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      set: function (val) {
        this.setDataValue('resp_nombre', val.toUpperCase());
      }
    },
    resp_cargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      set: function (val) {
        this.setDataValue('resp_cargo', val.toUpperCase());
      }
    }
  }, {
      tableName: 'responsable'
    });
};
