var express = require('express');
var router = express.Router();
var models = require('../database/models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function (req, res, next) {
  res.status(200).send({ hola: 'mundo hola' })
});

router.get('/prueba_db', function (req, res, next) {


  models.entidad.findAll().then(entidades => {
    res.status(200).send(entidades)
  }).catch(error => {
    res.status(500).send(error)
  })

});

router.post('/prueba_post', function (req, res, next) {
  let obj = req.body
  console.log(req.body);

  res.status(200).send({ f: 'hola', r: obj });
});

module.exports = router;
