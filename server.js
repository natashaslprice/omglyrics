/* 
 * SERVER.JS - setup for server, modules, middleware, database
 */

require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// set up base express app
var config = require('./config');
var express = require('express');
var app = express();

// other modules and middleware
var path = require('path');   // built-in module for dealing with file paths
var bodyParser = require('body-parser');  // parse form data into req.body
var cors = require('cors');
var logger = require('morgan');
var server = app.listen(config.port);
var mongoose = require('mongoose');   // object document mapper

// configure bodyparser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

// connect to database
var dbName = 'song-app';
// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/' + dbName);    
mongoose.connect(config.db);

// serve public folder as static assets on the root route
var publicPath = path.join(__dirname, 'public');
app.use("/", express.static(publicPath));

// alias the views folder
// var viewsPath = path.join(__dirname, 'views');
// app.set('views', viewsPath);

// set 'html' as the engine, using ejs's renderFile function
var ejs = require('ejs');
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');

/*** ROUTES ***/
var routes = require('./routes');

// INDEX and TEMPLATE ROUTES
app.get('/', routes.index);

app.get('/templates/:name', routes.templates);

// API ROUTES
// post routes
require('./routes/songs')(app);
require('./routes/users')(app);


// ALL OTHER ROUTES (ANGULAR HANDLES)
// redirect all other paths to index
app.get('*',  routes.index);


// SERVER
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// var port = process.env.PORT || 3000;

// var server = require('http').createServer(app);
// server = server.listen(port);
// console.log(process.env.NODE_ENV  + ' server running at port:' + port);

module.exports = server;
console.log('server running at http://localhost:' + config.port);

