let express = require('express')
let router = express.Router()
let models = require('../database/models')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {
  let options = {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }

  if (Object.keys(req.query).length > 0) {
    options.where = {}

    if (req.query.circ_asunto) {
      options.where.circ_asunto = {
        [Op.like]: '%' + req.query.circ_asunto.toUpperCase() + '%'
      }
    }

    if (req.query.enti_id) {
      options.where.enti_id = req.query.enti_id
    }

    if (req.query.resp_id) {
      options.where.resp_id = req.query.resp_id
    }

    if (req.query.area_id) {
      options.where.area_id = req.query.area_id
    }

    if (req.query.circ_fechadesde) {
      options.where.circ_fecha = {
        [Op.gte]: req.query.circ_fechadesde
      }
    }

    if (req.query.circ_fechahasta) {
      options.where.circ_fecha = {
        [Op.lte]: req.query.circ_fechahasta
      }
    }
  }

  options.include = [
    { model: models.area, as: 'area' },
    { model: models.responsable, as: 'responsable' },
    { model: models.entidad, as: 'entidad' }
  ]

  models.circular
    .findAll(options)
    .then(circulares => {
      res.status(200).send(circulares)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

router.post('/gestionar', (req, res, next) => {
  let circular = req.body
  if (!circular.circ_id) {
    models.circular.create(circular).then(circular => {
      res
        .status(200)
        .send({ msg: 'Circular creada correctamente', processOk: true })
    })
  } else {
    models.almacenar
      .findOne({
        where: {
          circ_id: circular.circ_id
        }
      })
      .then(almacenarObject => {
        if (almacenarObject) {
          res.status(200).send({
            msg:
              'La carga de la circular al sistema ya fue realizada, no se puede modificar',
            processOk: false
          })
        } else {
          models.circular
            .update(circular, { where: { circ_id: circular.circ_id } })
            .then(circularUpdated => {
              res.status(200).send({
                msg: 'Cambios guardados en la circular correctamente',
                processOk: true
              })
            })
            .catch(error => {
              res
                .status(500)
                .send({ msg: 'Error guandando cambios en la circular' })
              console.log(error)
            })
        }
      })
  }
})

router.post('/eliminar', (req, res, next) => {
  let circ_id = req.body.circ_id
  if (!circ_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  } else {
    models.almacenar
      .findOne({
        where: {
          circ_id: circ_id
        }
      })
      .then(almacenarObject => {
        if (almacenarObject) {
          res.status(200).send({
            msg:
              'La carga de la circular al sistema ya fue realizada, no se puede eliminar',
            processOk: false
          })
        } else {
          models.circular
            .destroy({
              where: { circ_id: circ_id }
            })
            .then(resp => {
              res.status(200).send({
                msg: 'Circular eliminada correctamente',
                processOk: true
              })
            })
            .catch(error => {
              res.status(500).send({ msg: 'Error eliminando la circular' })
              console.log(error)
            })
        }
      })
  }
})

module.exports = router
