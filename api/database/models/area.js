/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('area', {
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    area_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      set: function (val) {
        this.setDataValue('area_nombre', val.toUpperCase());
      }
    }
  }, {
    tableName: 'area'
  });
};
