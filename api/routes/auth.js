const express = require('express');
const router = express.Router();
const models = require('../database/models');
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const sha512 = require('crypto-js/sha512');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post('/get_tokens', function(req, res, next) {
  // aqui va el login xd
  // pendiente: JWT auth + sha512
})

router.post('/refresh_tokens', function(req, res, next) {
  // cuando los token mueran...
})

module.exports = router