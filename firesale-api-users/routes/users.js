var express = require('express');
var UserController = require('../controllers/UserController');
var router = express.Router();
//CREATE
router.post('/', function(req, res, next) {
  var data = req.body;
  UserController.save(data, function(error, singleObject){
    res.send(JSON.stringify(singleObject));
  });
});
//RETRIEVE ALL DATA
router.get('/', function(req, res, next) {
  UserController.search({}, function(error, results){
    res.send(JSON.stringify(results));
  });
});
//FOR VIEWING
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  UserController.view(id, function(error, singleObject){
    res.send(JSON.stringify(singleObject));
  });
});
//FOR UPDATING
router.post('/:id', function(req, res, next) {
  var data = req.body;
  var id = req.params.id;
  UserController.update(id, data ,function(error, singleObject){
    res.send(JSON.stringify(singleObject));
  });
});

//FOR DELLETING
router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  UserController.delete(id, function(error, singleObject){
    res.send(JSON.stringify(singleObject));
  });
});

//FOR DELLETING
router.get('/count', function(req, res, next) {
  var id = req.params.id;
  UserController.count({}, function(error, count){
    res.send(count);
  });
});

module.exports = router;
