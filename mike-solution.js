// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pg = require('pg');


// *** database *** //
var connectionString = 'postgres://localhost:5432/puppies';

// *** express instance *** //
var app = express();


// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //

// return ALL puppies
app.get('/api/puppies', function(req, res, next) {

    var responseArray = [];

    pg.connect(connectionString, function(err, client, done) {

      if(err) {
        done();
        return res.status(500).json({status: 'error', message: 'Something bad happend'});
      }

      // query the database
      var query = client.query('SELECT * from pups');

      // get all rows
      query.on('row', function(row) {
        responseArray.push(row);
      });

      // send data back as json
      query.on('end', function(){
        if(responseArray.length > 0) {
          res.json(responseArray);
        }
        res.json('The pound is empty. Go home.');
        done();
      });

      // close the connection
      pg.end();

    });

});

// return a SINGLE puppy
app.get('/api/puppy/:id', function(req, res, next) {

    var responseArray = [];

    pg.connect(connectionString, function(err, client, done) {

      if(err) {
        done();
        return res.status(500).json({status: 'error', message: 'Something bad happend'});
      }

      // query the database
      var query = client.query('SELECT * from pups WHERE id ='+req.params.id);

      // get all rows
      query.on('row', function(row) {
        responseArray.push(row);
      });

      // send data back as json
      query.on('end', function(){
        res.json(responseArray);
        done();
      });

      // close the connection
      pg.end();

    });

});

// add a SINGLE puppy
// sample curl => curl --data "name=michael&breed=thebest&age=23&sex=M&alive=true" localhost:5000/api/puppies
app.post('/api/puppies', function(req, res, next) {

    var newPuppy = req.body;

    pg.connect(connectionString, function(err, client, done) {

      if(err) {
        done();
        return res.status(500).json({status: 'error', message: 'Something bad happend'});
      }

      // insert into the database
      var query = client.query("INSERT into pups (name, breed, age, sex, alive) VALUES ('"+
        newPuppy.name+"','"+ newPuppy.breed+"','"+ newPuppy.age+"','"+ newPuppy.sex+"','"+ newPuppy.alive + "');");

      // send data back as json
      query.on('end', function(){
        res.json({status: 'success', message: 'Inserted new puppy into the pound!'});
        done();
      });

      // close the connection
      pg.end();

    });

});

// update a SINGLE puppy
// sample curl => curl -X PUT -d column=name -d value=johnny localhost:5000/api/puppy/id
app.put('/api/puppy/:id', function(req, res, next) {

    pg.connect(connectionString, function(err, client, done) {

      if(err) {
        done();
        return res.status(500).json({status: 'error', message: 'Something bad happend'});
      }

      // insert into the database
      var query = client.query("UPDATE pups SET " + req.body.column + "='" + req.body.value + "' WHERE id="+req.params.id);

      // send data back as json
      query.on('end', function(){
        res.json({status: 'success', message: 'Updated puppy!'});
        done();
      });

      // close the connection
      pg.end();

    });

});

// remove a SINGLE puppy
// sample curl => curl -X "DELETE" localhost:5000/api/puppy/1
app.delete('/api/puppy/:id', function(req, res, next) {

    pg.connect(connectionString, function(err, client, done) {

      if(err) {
        done();
        return res.status(500).json({status: 'error', message: 'Something bad happend'});
      }

      // query the database
      var query = client.query('DELETE from pups WHERE id ='+req.params.id);

      // send data back as json
      query.on('end', function(){
        res.json({status: 'success', message: 'Killed a puppy!'});
        done();
      });

      // close the connection
      pg.end();

    });

});


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
Status API Training Shop Blog About Pricing
© 2016 GitHub, Inc. Terms Privacy Security Contact Help