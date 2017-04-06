var express = require('express');
var router = express.Router();
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.col.insert({'hostname': os.hostname(), timestamp: new Date()}).
  then((docs) => {
    //inserted docs
  }).
  then(() => {
    return col.find(); //all docs
  }).
  then((docs) => {
    // return the first 10
    res.render('index',
    {
      title: 'Consul Demo App',
      hostname: os.hostname(),
      rows: docs.slice(0,10)
    });
  })
});

module.exports = router;
