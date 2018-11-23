let express = require('express');
let router = express.Router();
let models = require('../database/models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {

  let options = {}

  if (req.query.nombre) {
    let nombreSearch = req.query.nombre.toUpperCase()
    options.where = {
      enti_nombre: {
        [Op.like]: '%' + nombreSearch  + '%'
      }
    }
  }

  models.entidad.findAll(options).then(entidades => {
    res.status(200).send(entidades)
  }).catch(error => {
    res.status(500).send(error)
  })
});

router.post('/gestionar', (req, res, next) => {
  let entidad = req.body
  if (!entidad.enti_id) {
    models.entidad
      .findOrCreate({ where: { enti_nombre: entidad.enti_nombre }, defaults: entidad })
      .spread((entidad, created) => {
        return created
      }).then(created => {
        let msg = (created ? 'Entidad registrada correctamente' : 'Ya existe una entidad con el mismo nombre')
        res.status(200).send({ msg: msg, processOk: created })
      })

  } else {
    models.entidad.update(entidad,
      { where: { enti_id: entidad.enti_id } }).then(entidadUpdated => {
        res.status(200).send({ msg: 'Cambios guardados en la entidad correctamente', processOk: true })
      }).catch(error => {
        res.status(500).send({ msg: 'Error guandando cambios en la entidad' })
        console.log(error)
      })
  }
});

router.post('/eliminar', (req, res, next) => {
  let enti_id = req.body.enti_id
  if (!enti_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  }
  models.entidad.destroy({
    where: { enti_id: enti_id }
  }).then(resp => {
    res.status(200).send({ msg: 'Entidad eliminada correctamente' })
  }).catch(error => {
    res.status(500).send({ msg: 'Error eliminando la entidad' })
    console.log(error)
  })
});

module.exports = router;