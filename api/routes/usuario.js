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
    },
    where: {
      usua_id: {
        [Op.ne]: 1
      }
    }
  }).then(listUsuario => {
    res.status(200).send(listUsuario)
  })
})

router.post('/reestablecer_credenciales', function (req, res, next) {
  let usua_id = req.body.usua_id

  if (!usua_id) {
    return res.status(500).send('Error de comunicación')
  }

  models.usuario.findOne({
    where: {
      usua_id: usua_id
    }
  }).then(found => {
    if (!found) {
      return res.status(500).send('El usuario no existe')
    }

    found.usua_usuario = null
    found.usua_password = null
    found.usua_salt = null

    found.save().then(updated => {
      return res.status(200).send('Credenciales reestablecidas correctamente')
    }).catch(err => {
      console.log(err)
      return res.status(500).send('Error reestableciendo las credenciales')
    })
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

  if (!usua_id) {
    return res.status(500).send('Error de comunicación')
  }

  models.usuariorol.destroy({
    where: {
      usua_id: usua_id
    }
  }).then(usro_rows => {
    models.usuario.destroy({
      where: {
        usua_id: usua_id
      }
    }).then(rows => {
      console.log(rows)
      return res.status(200).send('Usuario eliminado correctamente')
    }).catch(err => {
      console.log(err)
      return res.status(500).send('Error eliminando el usuario')
    })
  }).catch(err => {
    console.log(err)
    return res.status(500).send('Error eliminando los roles del usuario')
  })



})

module.exports = router;