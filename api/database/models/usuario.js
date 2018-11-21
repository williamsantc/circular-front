/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario', {
    usua_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usua_nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usua_apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usua_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    usua_usuario: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    usua_password: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    usua_correo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    usua_salt: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'usuario'
  });
};
