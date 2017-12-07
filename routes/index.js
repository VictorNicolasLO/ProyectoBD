var express = require('express');
var router = express.Router();

var models = require("../models");



/* GET home page. */
router.get('/:name', function (req, res, next) {


  models[req.params.name].find({}, (result) => {
    res.send(result);
  });

  /*models.SUCURSAL.create({
    nombre: "Hola mundo",
    Telefono: 6672721193
  }, (err, result) => {
    if (!err)
      res.send(result);
    else res.send(err);
  })*/
});

router.delete('/:name/:id', function (req, res, next) {


  models[req.params.name].delete(req.params.id, (result) => {
    res.send(result);
  });


});


router.post('/direct', function (req, res, next) {
  
  
    models.query(req.body.query, (result) => {
     
        res.send(result).status(200);
      
    });
  
  
  });

router.post('/:name', function (req, res, next) {


  models[req.params.name].create(req.body.data, (err, result) => {
    if (!err)
      res.send(result).status(200);
    else
      res.send(err).status(500);
  });


});



router.put('/:name', function (req, res, next) {
  
  
    models[req.params.name].update(req.body.data, (err, result) => {
      if (!err)
        res.send(result).status(200);
      else
        res.status(500);
    });
  
  
  });

module.exports = router;
