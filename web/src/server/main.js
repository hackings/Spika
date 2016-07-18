// Load modules
var socket = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

var init = require('./init.js');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// initialization
var app = express();

app.use(morgan('combined', {stream: accessLogStream}));

var server = http.createServer(app);
var port = init.port;
var io = socket.listen(server);

// Start Spika as stand alone server
var spika = require('./index.js');

var SpikaServer = new spika(app,io,init);
    
server.listen(init.port, function(){
    console.log('Server listening on port ' + init.port + '!');
});
