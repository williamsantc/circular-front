let express = require('express')
let router = express.Router()
let models = require('../database/models')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {
  let options = {
    include: {
      model: models.funcionalidad,
      as: 'funcionalidad',
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      include: {
        model: models.funcionalidad,
        as: 'hijas',
        attributes: {
          exclude: ['updatedAt', 'createdAt'],
          order: [['func_orden', 'ASC']]
        }
      }
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }

  if (req.query.nombre) {
    let nombreSearch = req.query.descripcion.toUpperCase()
    options.where = {
      rol_descripcion: {
        [Op.like]: '%' + nombreSearch + '%'
      }
    }
  }

  models.rol
    .findAll(options)
    .then(roles => {
      res.status(200).send(roles)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

router.post('/gestionar', (req, res, next) => {
  let rol = req.body
  let funcionalidades = req.body.funcionalidad

  if (!rol.rol_id) {
    models.sequelize.transaction().then(t => {
      models.rol
        .findOrCreate({
          where: {
            rol_descripcion: rol.rol_descripcion
          },
          defaults: rol,
          transaction: t
        })
        .spread((rol, created) => {
          if (!created) {
            t.rollback()
            return res
              .status(200)
              .send({ msg: 'Ya existe un rol con la misma descripción' })
          }

          let listaRolFuncionalidad = funcionalidades.map(func_id => ({
            func_id: func_id,
            rol_id: rol.rol_id
          }))

          for (let ur in listaRolFuncionalidad) {
            models.rolfuncionalidad
              .create(listaRolFuncionalidad[ur], { transaction: t })
              .then(rolFuncInserted => {
                return rolFuncInserted
              })
              .catch(err => {
                console.log(err)
                t.rollback()
                return null
              })
              .then(obj => {
                let usUp = parseInt(ur) + 1
                if (listaRolFuncionalidad.length === usUp) {
                  t.commit()
                  return res.status(200).send({ msg: 'Registro exitoso' })
                }
              })
          }
        })
    })
  } else {
    models.sequelize.transaction().then(t => {
      models.rolfuncionalidad
        .destroy({
          where: {
            rol_id: rol.rol_id
          },
          transaction: t
        })
        .then(rows => {
          models.rol
            .update(rol, {
              where: {
                rol_id: rol.rol_id
              },
              transaction: t
            })
            .then(rolUpdated => {
              let listaRolFuncionalidad = funcionalidades.map(func_id => ({
                func_id: func_id,
                rol_id: rol.rol_id
              }))

              for (let ur in listaRolFuncionalidad) {
                models.rolfuncionalidad
                  .create(listaRolFuncionalidad[ur], { transaction: t })
                  .then(rolFuncInserted => {
                    return rolFuncInserted
                  })
                  .catch(err => {
                    console.log(err)
                    t.rollback()
                    return null
                  })
                  .then(obj => {
                    let usUp = parseInt(ur) + 1
                    if (listaRolFuncionalidad.length === usUp) {
                      t.commit()
                      return res
                        .status(200)
                        .send({ msg: 'Modificación exitosa' })
                    }
                  })
              }
            })
            .catch(err => {
              t.rollback()
              console.log(err)
            })
        })
        .catch(err => {
          t.rollback()
          console.log(err)
        })
    })
  }
})

router.post('/eliminar', (req, res, next) => {
  let rol_id = req.body.rol_id

  models.sequelize
    .transaction(t => {
      return models.rolfuncionalidad
        .destroy({
          where: {
            rol_id: rol_id
          },
          transaction: t
        })
        .then(rows => {
          return models.rol.destroy({
            where: {
              rol_id: rol_id
            },
            transaction: t
          })
        })
    })
    .then(result => {
      res.status(200).send({ msg: 'Eliminación exitosa' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ msg: 'Error eliminando' })
    })
})

module.exports = router
