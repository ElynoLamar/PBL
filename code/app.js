var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var playerRouter = require('./routes/playersRoute');
var teamRouter = require('./routes/teamsRoute');
var eventRouter = require('./routes/eventsRoute');
var roleRouter = require('./routes/roleRoute');
var notifRouter = require('./routes/notifRoute');
var fieldsRouter = require('./routes/fieldsRoute');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/teams', teamRouter);
app.use('/api/players', playerRouter);
app.use('/api/events', eventRouter);
app.use('/api/roles', roleRouter);
app.use('/api/notifications', notifRouter);
app.use('/api/fields', fieldsRouter);
module.exports = app;
