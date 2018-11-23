/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('circular', {
    circ_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    circ_asunto: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    circ_contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'area',
        key: 'area_id'
      }
    },
    enti_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'entidad',
        key: 'enti_id'
      }
    },
    resp_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'responsable',
        key: 'resp_id'
      }
    },
    circ_anexos: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    circ_fecha: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'circular'
  });
};
