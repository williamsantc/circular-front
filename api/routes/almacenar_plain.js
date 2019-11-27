let express = require('express')
let router = express.Router()
let models = require('../database/models')
let path = require('path')
let fs = require('fs')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/list', function(req, res, next) {
  let options = {
    attributes: { exclude: ['createdAt', 'updatedAt', 'alma_file'] }
  }

  if (Object.keys(req.query).length > 0) {
    options.where = {}

    if (req.query.alma_descripcion) {
      options.where.alma_descripcion = {
        [Op.like]: '%' + req.query.alma_descripcion.toUpperCase() + '%'
      }
    }

    if (req.query.circ_id) {
      options.where.circ_id = req.query.circ_id
    }
  }

  options.include = [{ model: models.circular, as: 'circular' }]

  models.almacenar
    .findAll(options)
    .then(objects => {
      res.status(200).send(objects)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/eliminar', function(req, res, next) {
  console.log(req.body)
  let alma_id = req.body.alma_id

  if (!alma_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  } else {
    models.almacenar
      .findOne({
        where: {
          alma_id: alma_id
        }
      })
      .then(found => {
        models.almacenar
          .destroy({
            where: { alma_id: alma_id }
          })
          .then(resp => {
            console.log(resp)
            return resp > 0
          })
          .catch(error => {
            console.log('ERR: ' + error)
            return false
          })
          .then(boo => {
            if (boo) {
              fs.unlink(
                __dirname + '/../../uploads/' + found.alma_file,
                err => {
                  if (err) {
                    console.log('ERR: ' + err)
                    res.status(200).send({
                      title: 'Error de archivo',
                      msg: 'Error eliminando el archivo',
                      variant: 'error'
                    })
                  } else {
                    res.status(200).send({
                      title: 'OK',
                      msg: 'Circular eliminada correctamente',
                      variant: 'success'
                    })
                  }
                }
              )
            } else {
              res.status(200).send({
                title: 'ERROR',
                msg: 'Error eliminando la circular',
                variant: 'success'
              })
            }
          })
      })
  }
})

// Solo descarga
router.get('/get', function(req, res, next) {
  if (!req.query.circular) {
    res.status(404).send()
  } else {
    models.almacenar
      .findOne({
        where: {
          alma_id: req.query.circular
        }
      })
      .then(object => {
        if (!object) res.status(404).send()

        res.download(
          './uploads/' + object.alma_file,
          'circular_download.pdf',
          err => {
            if (err) {
              console.log('ERR: ' + err)
              return
            }
          }
        )
      })
  }
})

module.exports = router
