/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('login_attempts', {
    loat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'user_id'
      }
    },
    time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'login_attempts'
  });
};
