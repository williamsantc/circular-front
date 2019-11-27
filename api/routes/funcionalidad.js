let express = require('express')
let router = express.Router()
let models = require('../database/models')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {
  let options = {
    include: {
      model: models.funcionalidad,
      as: 'padre',
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['func_orden', 'ASC']]
  }

  if (req.query.nombre) {
    let nombreSearch = req.query.nombre.toUpperCase()
    options.where = {
      func_descripcion: {
        [Op.like]: '%' + nombreSearch + '%'
      }
    }
  }

  models.funcionalidad
    .findAll(options)
    .then(funcs => {
      res.status(200).send(funcs)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

router.get('/listar_func_hijas', (req, res, next) => {
  let options = {
    include: {
      model: models.funcionalidad,
      as: 'hijas',
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
        order: [['func_orden', 'ASC']]
      }
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['func_orden', 'ASC']]
  }

  models.funcionalidad
    .findAll(options)
    .then(funcs => {
      let funcsFiltered = funcs.filter(func => func.func_padre === null)

      res.status(200).send(funcsFiltered)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

router.get('/listar_nav', (req, res, next) => {
  let user_id = req.decoded.dataUsuario.usua_id

  // Por ahora todas las func

  let options = {
    include: {
      model: models.funcionalidad,
      as: 'hijas',
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
        order: [['func_orden', 'ASC']]
      }
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['func_orden', 'ASC']]
  }

  models.usuario
    .findOne({
      include: {
        model: models.rol,
        as: 'rol',
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        },
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
        }
      },
      where: {
        usua_id: user_id
      }
    })
    .then(user => {
      let rolFuncionalidad = []

      user.rol.forEach(rol => {
        let funcsFiltered = rol.funcionalidad.filter(
          func => func.func_padre === null
        )

        let nav = []

        funcsFiltered.forEach(funcFil => {
          let funcNav = {
            name: funcFil.func_descripcion,
            url: funcFil.func_url,
            icon: funcFil.func_icono
          }

          if (funcFil.hijas.length > 0) {
            funcNav.children = []
          }

          funcFil.hijas.forEach(funcHija => {
            let funcNavHija = {
              name: funcHija.func_descripcion,
              url: funcHija.func_url,
              icon: funcHija.func_icono
            }

            funcNav.children.push(funcNavHija)
          })

          nav.push(funcNav)
        })

        rolFuncionalidad.push({ rol_id: rol.rol_id, nav: nav })
      })

      res.status(200).send(rolFuncionalidad)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error)
    })
})

router.post('/gestionar', (req, res, next) => {
  let funcionalidad = req.body
  if (!funcionalidad.func_id) {
    models.funcionalidad
      .findOrCreate({
        where: { func_descripcion: funcionalidad.func_descripcion },
        defaults: funcionalidad
      })
      .spread((funcionalidad, created) => {
        return created
      })
      .then(created => {
        let msg = funcionalidad
          ? 'Funcionalidad registrada correctamente'
          : 'Ya existe una funcionalidad con el mismo nombre'
        res.status(200).send({ msg: msg, processOk: created })
      })
  } else {
    models.funcionalidad
      .update(funcionalidad, { where: { func_id: funcionalidad.func_id } })
      .then(funcionalidadUpdated => {
        res.status(200).send({
          msg: 'Cambios guardados en la funcionalidad correctamente',
          processOk: true
        })
      })
      .catch(error => {
        res
          .status(500)
          .send({ msg: 'Error guandando cambios en la funcionalidad' })
        console.log(error)
      })
  }
})

router.post('/eliminar', (req, res, next) => {
  let func_id = req.body.func_id
  if (!func_id) {
    res.status(500).send({ msg: 'Error de comunicación' })
  }
  models.funcionalidad
    .destroy({
      where: { func_id: func_id }
    })
    .then(resp => {
      res.status(200).send({ msg: 'Funcionalidad eliminada correctamente' })
    })
    .catch(error => {
      res.status(500).send({ msg: 'Error eliminando la funcionalidad' })
      console.log(error)
    })
})

module.exports = router
