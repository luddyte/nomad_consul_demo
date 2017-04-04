var express = require('express');
var router = express.Router();
var os = require('os');
const consul = require('consul')();

const service_name = 'mongodb'; // this could be an env var from nomad
var service_addr;
var service_port;
var db;
var col;

function get_db() {
  consul.catalog.service.nodes('mongodb', function(err, result) {
    if (err) throw err;
    service_addr = result[0].ServiceAddress;
    service_port = result[0].ServicePort;
    console.log(`Consul returned addr ${service_addr} and port ${service_port}`);
    var mongo_conn_string = service_addr + ':' + service_port + '/demo';
    console.log(`conn_string: ${mongo_conn_string}`);
    db = require('monk')(mongo_conn_string);
    db.create('timestamps');
}

// initialize DB
get_db();

/* GET home page. */
router.get('/', function(req, res, next) {
  col = db.get('timestamps');
  col.insert({'hostname': os.hostname(), timestamp: new Date()}).
  then((docs) => {
    //inserted docs
  }).
  then(() => {
    col.find() //all docs
  }).then((docs) {
    // return the first 10
    res.render('index', { title: 'Consul Demo App', hostname: os.hostname(), rows: docs.slice(0,10) });
  )}
});

module.exports = router;
