let express = require('express');
let router = express.Router();
let models = require('../database/models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {

  let options = {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }

  if (req.query.nombre) {
    let nombreSearch = req.query.nombre.toUpperCase()
    options.where = {
      resp_nombre: {
        [Op.like]: '%' + nombreSearch  + '%'
      }
    }
  }

  models.responsable.findAll(options).then(responsables => {
    res.status(200).send(responsables)
  }).catch(error => {
    res.status(500).send(error)
  })
});

router.post('/gestionar', (req, res, next) => {
  let responsable = req.body
  if (!responsable.resp_id) {
    models.responsable
      .findOrCreate({ where: { resp_nombre: responsable.resp_nombre }, defaults: responsable })
      .spread((responsable, created) => {
        return created
      }).then(created => {
        let msg = (created ? 'Responsable registrado correctamente' : 'Ya existe un responsable con el mismo nombre')
        res.status(200).send({ msg: msg, processOk: created })
      })

  } else {
    models.responsable.update(responsable,
      { where: { resp_id: responsable.resp_id } }).then(responsableUpdated => {
        res.status(200).send({ msg: 'Cambios guardados en el responsable correctamente', processOk: true })
      }).catch(error => {
        res.status(500).send({ msg: 'Error guandando cambios en el responsable' })
        console.log(error)
      })
  }
});

router.post('/eliminar', (req, res, next) => {
  let resp_id = req.body.resp_id
  if (!resp_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  }
  models.responsable.destroy({
    where: { resp_id: resp_id }
  }).then(resp => {
    res.status(200).send({ msg: 'Responsable eliminado correctamente' })
  }).catch(error => {
    res.status(500).send({ msg: 'Error eliminando el responsable' })
    console.log(error)
  })
});

module.exports = router;