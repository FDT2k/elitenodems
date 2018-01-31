// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var config     = require('./conf');
var jwt        = require('express-jwt');

var mongoose   = require('mongoose');
var zmqworker = require('./ZMQWorker');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api',jwt({ secret: config.authSettings.JWT_KEY}).unless({path:[/\/api\/currency\/?/i,'/api/user/register']}));
app.use('/api',function(req, res, next) {
//  console.log(res);
  next();
});
var port = process.env.PORT || 8080;        // set our port

mongoose.connect('mongodb://'+config.dbSettings.servers+'/'+config.dbSettings.db);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', [router]);

// START THE SERVER
// =============================================================================
app.listen(port);

zmqworker();
console.log('Magic happens on port ' + port);
