var express = require('express');
var parser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.send('hello world!');
})

app.listen(port, function() {
  console.log('listening on port ', port);
});

module.exports = app;
