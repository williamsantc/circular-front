let express = require('express');
let router = express.Router();
let models = require('../database/models');
let multer = require('multer')
let path = require('path')
let fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, 'signed_' + new Date().getTime() + '_id_' + req.body.circ_id + path.extname(file.originalname))
  }
})

let uploads = multer({ storage: storage }).single('alma_file')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/gestionar', function (req, res, next) {

  uploads(req, res, function (err) {
    if (err) {
      console.log(err)
      res.status(500).send('Error Upload file')
      return
    }

    let almacenar = req.body
    almacenar.alma_file = req.file.filename

    if (!almacenar.alma_id) {

      models.almacenar.create(almacenar).then(almacenar => {
        res.status(200).send({
          title: 'OK',
          msg: 'Circular almacenada correctamente',
          variant: 'success'
        })
      }).catch(error => {
        console.log('ERR: ' + error)
        fs.unlink(__dirname + '/../../uploads/' + almacenar.alma_file, (err) => {
          if (err) {
            console.log('ERR: ' + err)
          }
        })
        res.status(200).send({
          title: 'Circular ya almacenada',
          msg: 'Si desea reemplazar el archivo de la circular, modifiquela',
          variant: 'error'
        })
      })
    } else {
      models.almacenar.findOne({
        where: {
          alma_id: almacenar.alma_id
        }
      }).then(found => {
        if (!found) {
          res.status(200).send({ title: 'Error', msg: 'Id de almacenado no encontrado', variant: 'error' })
        } else {

          models.almacenar.update(almacenar, {
            where: {
              alma_id: almacenar.alma_id
            }
          }).then(updated => {
            fs.unlink(__dirname + '/../../uploads/' + found.alma_file, (err) => {
              if (err) {
                console.log('ERR: ' + err)
                res.status(200).send({
                  title: 'Error de archivo',
                  msg: 'Error eliminando el archivo anterior',
                  variant: 'error'
                })
              } else {
                res.status(200).send({
                  title: 'OK',
                  msg: 'Circular modificada correctamente',
                  variant: 'success'
                })
              }

            })
          })
        }
      })
    }
  })

})

module.exports = router;