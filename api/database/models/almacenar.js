/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('almacenar', {
    alma_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    alma_url: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    alma_descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    circ_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'almacenar'
  });
};
