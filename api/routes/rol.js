let express = require('express');
let router = express.Router();
let models = require('../database/models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/list', (req, res, next) => {

  let options = {
    include: {
      model: models.funcionalidad,
      as: 'funcionalidad',
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }

  if (req.query.nombre) {
    let nombreSearch = req.query.descripcion.toUpperCase()
    options.where = {
      rol_descripcion: {
        [Op.like]: '%' + nombreSearch  + '%'
      }
    }
  }

  models.rol.findAll(options).then(roles => {
    res.status(200).send(roles)
  }).catch(error => {
    res.status(500).send(error)
  })
});

module.exports = router;