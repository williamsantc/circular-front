var express = require('express');
var router = express.Router();
var models = require('../database/models');

router.get('/list', (req, res, next) => {
  models.area.findAll().then(areas => {
    res.status(200).send(areas)
  }).catch(error => {
    res.status(500).send(error)
  })
});

router.post('/gestionar', (req, res, next) => {
  let area = req.body
  if (!area.area_id) {
    models.area.create(area).then(areaCreated => {
      res.status(200).send({ msg: 'Area registrada correctamente' })
    }).catch(error => {
      res.status(500).send({ msg: 'Error registrando el area' })
      console.log(error)
    })
  } else {
    models.area.update(area,
      { where: { area_id: area.area_id } }).then(areaUpdated => {
        res.status(200).send({ msg: 'Cambios guardados en el area correctamente' })
      }).catch(error => {
        res.status(500).send({ msg: 'Error guandando cambios el area' })
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