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
    },
    attributes: {
      exclude: ['usua_password', 'usua_salt', 'updatedAt', 'createdAt']
    }
  }).then(listUsuario => {
    res.status(200).send(listUsuario)
  })
})

router.post('/gestionar', function (req, res, next) {
  let usuario = req.body
  let listaRoles = req.body.rol
  if (!usuario.usua_id) {
    models.sequelize.transaction().then(t => {
      models.usuario
        .findOrCreate({
          where: {
            usua_documento: usuario.usua_documento
          },
          defaults: usuario,
          transaction: t
        })
        .spread((usuario, created) => {
          if (!created) {
            t.rollback()
            return res.status(200).send({ msg: 'Ya existe un usuario con el mismo número de documento' })
          }

          let listaUsuarioRol = listaRoles.map(rol => ({ rol_id: rol, usua_id: usuario.usua_id }))

          for (let ur in listaUsuarioRol) {
            models.usuariorol.create(listaUsuarioRol[ur], { transaction: t }).then(usuarioRolInserted => {
              return usuarioRolInserted
            }).catch(err => {
              console.log(err)
              t.rollback()
              return null
            }).then(obj => {

              let usUp = parseInt(ur) + 1
              if (listaUsuarioRol.length === usUp) {
                t.commit()
                return res.status(200).send({ msg: 'Registro exitoso' })
              }
            })
          }


        })
    })
  } else {
    models.sequelize.transaction().then(t => {
      models.usuariorol.destroy({
        where: {
          usua_id: usuario.usua_id
        },
        transaction: t
      }).then(rows => {
        models.usuario.update(usuario, {
          where: {
            usua_id: usuario.usua_id
          },
          transaction: t
        }).then(usuarioUpdated => {

          let listaUsuarioRol = listaRoles.map(rol => ({ rol_id: rol, usua_id: usuario.usua_id }))

          for (let ur in listaUsuarioRol) {
            models.usuariorol.create(listaUsuarioRol[ur], { transaction: t }).then(usuarioRolInserted => {
              return usuarioRolInserted
            }).catch(err => {
              console.log(err)
              t.rollback()
              return null
            }).then(obj => {

              let usUp = parseInt(ur) + 1
              if (listaUsuarioRol.length === usUp) {
                t.commit()
                return res.status(200).send({ msg: 'Modificación exitosa' })
              }
            })
          }
        }).catch(err => {
          t.rollback()
          console.log(err)
        })
      }).catch(err => {
        t.rollback()
        console.log(err)
      })
    })
  }
})

router.post('/eliminar', function (req, res, next) {
  let usua_id = req.body.usua_id

  
})

module.exports = router;