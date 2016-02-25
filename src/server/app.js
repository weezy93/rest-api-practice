// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pg = require("pg");
var pg_escape = require("pg-escape");

// *** database *** //
var connectionString = 'postgres://localhost:5432/puppies';

// *** express instance *** //
var app = express();

// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));




// return all puppies
app.get('/api/puppies', function(req, res, next){
  var responseArray = [];

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      return res.status(500).json({
        status: error,
        message: "Something went wrong"
      });
    }

   var queryString = client.query(("SELECT * FROM puppies;"));

   queryString.on('row', function(row){
    responseArray.push(row);
   });

   queryString.on('end', function(){
    res.json({
      status: 'success',
      message: responseArray
    });
    if (responseArray < 1){
      res.json({
        status: 'success',
        message: "no puppies"
      });
    }
    done();
   });
   pg.end();
  });
});


// insert into puppies
app.post('/api/puppies', function(req, res, next){
  var newPuppy = req.body;
  console.log(newPuppy);

  pg.connect(connectionString, function(err, client, done){

    if(err){ // send status code and error
      done();
     return res.status(500).json({
        status: error,
        message: "Something went wrong"
      });
    } // no error

    var queryString = 'INSERT INTO puppies (name, breed, age, potty_trained) VALUES (\''+ newPuppy.name + "','" + newPuppy.breed+"'," +  newPuppy.age+"," + newPuppy.potty_trained + ');';
    console.log(queryString);
// query data base
    var query = client.query(queryString);

// send back data as json
    query.on('end', function(){
      res.json({
        status: 'success',
        message: 'Inserted new puppy into the pound!'
      });
      done();
    });
// close connection
    pg.end();
  });
});


// remove a single puppy
app.delete('/api/puppies/:id', function(req, res, next){

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      return res.status(500).json({
        status: error,
        message: "Something went wrong"
      });
    }

   var query = client.query("DELETE from puppies WHERE id = "+req.params.id);

   query.on('end', function(){
    res.json({
      status: 'success',
      message: "puppy got adopted"
    });
    done();
   });

   pg.end();
  });
});

// update a single puppy
// curl -X PUT -d column=name -d value= row localhost:5000/api/puppies/id'
app.put('/api/puppies/:id', function(req,res, next){
  var newPuppy = req.body;
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      return res.status(500).json({
        status: error,
        message: "Something went wrong"
      });
    }

    var query = client.query("UPDATE puppies SET "+ req.body.column+"='"+ req.body.value+"' WHERE id = "+req.params.id+ ";");

    query.on('end', function(){
      res.json({
        status: 'success',
        message: 'updated'
      });
    });
pg.end();
  });
});




// // *** routes *** //
var routes = require('./routes/index.js');
// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));

// *** main routes *** //
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
