const express = require('express');
const router = express.Router();
const models = require('../database/models');
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const authSettings = require('../authSettings')

import { AuthMiddleware } from '../AuthMiddleware'

router.post('/get_token', function (req, res, next) {
  let credentials = req.body
  if (credentials && credentials.user && credentials.pass) {
    models.usuario.findOne({
      where: {
        usua_usuario: credentials.user
      }
    }).then(usuario => {
      if (!usuario) {
        res.status(403).send('Usuario no encontrado')
        return
      }

      let realPassword = CryptoJS.SHA512(credentials.pass + usuario.usua_salt).toString(CryptoJS.enc.Hex)

      if (realPassword === usuario.usua_password) {
        let usuarioResp = {
          documento: usuario.usua_documento,
          nombreCompleto: usuario.usua_apellido + ' ' + usuario.usua_nombre,
          usuario: usuario.usua_usuario,
          correo: usuario.usua_correo
        }
        let dateSign = new Date()
        const token = jwt.sign({ dataUsuario: usuarioResp }, authSettings.sign, { expiresIn: authSettings.expiresIn });
        res.status(200).send({ accessToken: token, dataUsuario: usuarioResp })
      } else {
        res.status(403).send('contraseña incorrecta')
      }

    })
  }
})

router.get('/check_token', AuthMiddleware, function(req, res, next) {
  res.status(200).send('OK')
})

router.post('/refresh_token', function (req, res, next) {
  // cuando los token mueran...

})

module.exports = router