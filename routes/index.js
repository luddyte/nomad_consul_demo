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
    return col.find({}, {sort: { natural: -1 }, {limit: 10}});
  }).
  then((docs) => {
    // return the first 10
    res.render('index',
    {
      title: 'Consul Demo App',
      hostname: os.hostname(),
      //rows: docs.slice(0,9)
      rows: docs
    });
  })
});

module.exports = router;
