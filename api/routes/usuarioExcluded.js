let express = require('express');
let router = express.Router();
let models = require('../database/models');

const CryptoJS = require('crypto-js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import { randomWord } from '../../utils/stringUtils'


router.get('/consultar_registrado', function (req, res, next) {
  let documento = req.query.doc

  if (!documento) {
    return res.status(200).send('Documento no enviado')
  }
  models.usuario.findOne({
    where: {
      usua_documento: documento
    }
  }).then(user => {
    if (!user) {
      return res.status(200).send('Usuario no registrado')
    } else {
      if (!user.usua_usuario) {
        return res.status(200).send('OK')
      } else {
        return res.status(200).send('Usuario ya posee cuenta')
      }
    }
  }).catch(err => {
    console.log(err)
    return res.status(500).send('Internal error')
  })
})

router.post('/finalizar_registro', function (req, res, next) {
  let user = req.body

  if (!user) {
    return res.status(500).send('Error de comunicación')
  }

  if (user.usua_password.length != 128) {
    return res.status(500).send('la contraseña no está cifrada')
  }

  models.usuario.findOne({
    where: {
      usua_usuario: user.usua_usuario
    }
  }).then(userAccount => {
    if (userAccount) {
      return res.status(500).send('El nombre de usuario que ingresó ya existe.')
    }

    models.usuario.findOne({
      where: {
        usua_documento: user.usua_documento
      }
    }).then(userFound => {
      if (!userFound) {
        return res.status(500).send('Documento no registrado')
      }

      if (userFound.usua_usuario) {
        return res.status(500).send('El usuario ya posee cuenta')
      }

      userFound.usua_usuario = user.usua_usuario
      let randomSalt = CryptoJS.SHA512(randomWord(10).trim()).toString(CryptoJS.enc.Hex)
      userFound.usua_salt = randomSalt

      let newPassword = CryptoJS.SHA512(user.usua_password + randomSalt).toString(CryptoJS.enc.Hex)

      userFound.usua_password = newPassword

      userFound.save().then(updated => {
        return res.status(200).send('Usuario creado correctamente')
      }).catch(err => {
        console.log(err)
        return res.status(500).send('Error registrando los datos')
      })

    })
  })

})

module.exports = router;