let express = require('express');
let router = express.Router();
let models = require('../database/models');
var multer = require('multer')
let path = require('path')

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

router.post('/save', function (req, res, next) {

  uploads(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end('Error Upload file')
    }

    // falta la logica de insersión en la DB
    console.log(req.file)
    console.log(req.body)
    res.status(200).send('ok')

  })

})


// Solo descarga
router.get('/get', function (req, res, next) {
  res.download('./uploads/alma_file.pdf', 'user-facing-filename.pdf', (err) => {
    if (err) {
      //handle error
      return
    } else {
      //do something
    }
  })
})

module.exports = router;