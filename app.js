var express = require('express');
var path = require('path');
require('marko/compiler').defaultOptions.writeToDisk = false;
require('marko/node-require').install();
var app = express();

// app.get('/', require('./routes/index'));

// app.listen(3000, function(){
//   console.log('Listening on port: 3000');
// });
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imgRouter = require('./routes/img');
var handleRouter = require('./routes/handle');

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/img',imgRouter);
app.use('/handle',handleRouter);

module.exports = app;