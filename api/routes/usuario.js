let express = require('express');
let router = express.Router();
let models = require('../database/models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/list', function (req, res, next) {
  models.usuario.findAll({
    include: {
      model: models.rol,
      as: 'rol',
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
      /*
      ,include: {
        model: models.funcionalidad,
        as: 'funcionalidad',
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        }
      }
      */
    },
    attributes: {
      exclude: ['usua_password', 'usua_salt', 'updatedAt', 'createdAt']
    }
  }).then(listUsuario => {
    res.status(200).send(listUsuario)
  })
})

module.exports = router;