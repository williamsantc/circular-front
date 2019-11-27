/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'rolfuncionalidad',
    {
      rofu_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      rol_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'rol',
          key: 'rol_id'
        }
      },
      func_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'funcionalidad',
          key: 'func_id'
        }
      }
    },
    {
      tableName: 'rolfuncionalidad'
    }
  )
}
