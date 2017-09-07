var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
require('marko/compiler').defaultOptions.writeToDisk = false;
require('marko/node-require').install();
var app = express();

// app.get('/', require('./routes/index'));

// app.listen(3000, function(){
//   console.log('Listening on port: 3000');
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes/note')));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imgRouter = require('./routes/img');
var handleRouter = require('./routes/handle');
var videoRouter = require('./routes/video');
var noteRouter = require('./routes/note');

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/img',imgRouter);
app.use('/handle',handleRouter);
app.use('/video',videoRouter);
app.use('/note',noteRouter);


module.exports = app;