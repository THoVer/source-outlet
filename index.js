#!/usr/bin/env node
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var config = require('./config.'+process.env.NODE_ENV+'.js');

/*var privateKey = fs.readFileSync(path.join(config.app.certPath, '/privkey.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(config.app.certPath, '/fullchain.pem'), 'utf8');
var credentials = { key: privateKey, cert: certificate };
*/
var app = express();
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

app.use(express.static(path.join(__dirname, '/src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/', function (req, res) {
    res.sendFile('hello world')
})

httpServer.listen(config.app.port, config.app.ip, function() {
    console.log('listening on ' + config.app.ip + ':' + config.app.port);
});
/*httpsServer.listen(config.app.securePort, config.app.ip, function() {
    onsole.log('listening on ' + config.app.ip + ':' + config.app.securePort);
});*/