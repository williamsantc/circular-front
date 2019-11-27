/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'entidad',
    {
      enti_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      enti_nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        set: function(val) {
          this.setDataValue('enti_nombre', val.toUpperCase())
        }
      }
    },
    {
      tableName: 'entidad'
    }
  )
}
