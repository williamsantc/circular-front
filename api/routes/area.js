let express = require('express');
let router = express.Router();
let models = require('../database/models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/list', (req, res, next) => {

  let options = {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }

  if (req.query.nombre) {
    let nombreSearch = req.query.nombre.toUpperCase()
    options.where = {
      area_nombre: {
        [Op.like]: '%' + nombreSearch + '%'
      }
    }
  }

  models.area.findAll(options).then(areas => {
    res.status(200).send(areas)
  }).catch(error => {
    res.status(500).send(error)
  })
});

router.post('/gestionar', (req, res, next) => {
  let area = req.body
  if (!area.area_id) {
    models.area
      .findOrCreate({ where: { area_nombre: area.area_nombre }, defaults: area })
      .spread((area, created) => {
        return created
      }).then(created => {
        let msg = (created ? 'Area registrada correctamente' : 'Ya existe un area con el mismo nombre')
        res.status(200).send({ msg: msg, processOk: created })
      })

  } else {
    models.area.update(area,
      { where: { area_id: area.area_id } }).then(areaUpdated => {
        res.status(200).send({ msg: 'Cambios guardados en el area correctamente', processOk: true })
      }).catch(error => {
        res.status(500).send({ msg: 'Error guandando cambios en el area' })
        console.log(error)
      })
  }
});

router.post('/eliminar', (req, res, next) => {
  let area_id = req.body.area_id
  if (!area_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  }
  models.area.destroy({
    where: { area_id: area_id }
  }).then(resp => {
    res.status(200).send({ msg: 'Area eliminada correctamente' })
  }).catch(error => {
    res.status(500).send({ msg: 'Error eliminando el area' })
    console.log(error)
  })
});

module.exports = router;