const express = require('express')
const router = express.Router()
const models = require('../database/models')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
const jwtDecode = require('jwt-decode')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

import authSettings from '../authSettings'

import { AuthMiddleware } from '../AuthMiddleware'

router.post('/get_token', function(req, res, next) {
  let credentials = req.body
  if (credentials && credentials.user && credentials.pass) {
    models.usuario
      .findOne({
        include: {
          model: models.rol,
          as: 'rol',
          attributes: {
            exclude: ['updatedAt', 'createdAt']
          }
        },
        where: {
          usua_usuario: credentials.user
        },
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        }
      })
      .then(usuario => {
        if (!usuario) {
          res.status(403).send('Usuario no encontrado')
          return
        }

        let realPassword = CryptoJS.SHA512(
          credentials.pass + usuario.usua_salt
        ).toString(CryptoJS.enc.Hex)

        if (realPassword === usuario.usua_password) {
          let usuarioResp = {
            userId: usuario.usua_id,
            documento: usuario.usua_documento,
            nombreCompleto: usuario.usua_apellido + ' ' + usuario.usua_nombre,
            usuario: usuario.usua_usuario,
            correo: usuario.usua_correo
          }
          let dateSign =
            authSettings.sign +
            new Date().getDate() +
            (new Date().getMonth() + 1) +
            new Date().getFullYear()
          const token = jwt.sign({ dataUsuario: usuario }, dateSign, {
            expiresIn: authSettings.expiresIn
          })
          res.status(200).send({ accessToken: token, dataUsuario: usuario })
        } else {
          res.status(403).send('contraseña incorrecta')
        }
      })
  }
})

router.get('/check_token', AuthMiddleware, function(req, res, next) {
  res.status(200).send('OK')
})

router.post('/refresh_token', function(req, res, next) {
  // cuando los token mueran...
  let authHeader = req.body.accessToken.replace('Bearer ', '').trim()

  let user = ''

  if (req.body.dataUsuario) {
    user = req.body.dataUsuario
  } else {
    return res.status(403).send({ error: true, message: 'Invalid user.' })
  }

  let dateSign =
    authSettings.sign +
    new Date().getDate() +
    (new Date().getMonth() + 1) +
    new Date().getFullYear()
  // verifies secret and checks exp
  jwt.verify(authHeader, dateSign, function(err, decoded) {
    if (err && err.name === 'TokenExpiredError') {
      const token = jwt.sign({ dataUsuario: user }, dateSign, {
        expiresIn: authSettings.expiresIn
      })

      return res.status(200).send({ accessToken: token })
    } else if (err) {
      return res.status(403).send({ error: true, message: 'Invalid token.' })
    } else {
      return res.status(200).send({ valid: 'Token still alive.' })
    }
  })
})

module.exports = router
