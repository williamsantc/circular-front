/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'almacenar',
    {
      alma_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      alma_file: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      alma_descripcion: {
        type: DataTypes.STRING(200),
        allowNull: true,
        set: function(val) {
          this.setDataValue('alma_descripcion', val.toUpperCase())
        }
      },
      circ_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        unique: true,
        references: {
          model: 'cirular',
          key: 'circ_id'
        }
      }
    },
    {
      tableName: 'almacenar'
    }
  )
}
