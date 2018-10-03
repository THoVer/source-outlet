#!/usr/bin/env node
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var getFavicons = require('get-website-favicon')

var config = require('./config.'+process.env.NODE_ENV+'.js');

/*var privateKey = fs.readFileSync(path.join(config.app.certPath, '/privkey.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(config.app.certPath, '/fullchain.pem'), 'utf8');
var credentials = { key: privateKey, cert: certificate };
*/
var app = express();
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

app.use('/public', express.static(path.join(__dirname, '/src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/somethingdifferent', function (req, res) {
    res.send('ok')
})

app.get('/stats', (req, res) => {
    data = loadData();
    res.send(data);
})

/* final catch-all route to index.html defined last */
app.get('/', (req, res) => {
    referer = getSource(req);
    createOrIncrementSource(referer);
    // save referer in database (?)
    res.sendFile(__dirname + '/src/index.html');
})

httpServer.listen(config.app.port, config.app.ip, function() {
    console.log('listening on ' + config.app.ip + ':' + config.app.port);
});
/*httpsServer.listen(config.app.securePort, config.app.ip, function() {
    onsole.log('listening on ' + config.app.ip + ':' + config.app.securePort);
});*/

function getSource(req) {
    let referer;
    
    // First check referer
    if (req.headers.referer) {
        referer = req.headers.referer;
    }
    if (req.url) {
        referer = req.url;
    }

    return referer;
}

async function createOrIncrementSource(referer) {
    // Increment count of visits from this particular referer
    let updated = await incrementReferer(referer);
    if (!updated)
        await createReferer(referer);
    
}

async function incrementReferer(referer) {
    // TODO: Implement with database
    return false;
}

async function createReferer(referer) {
    return;
    // TODO: Implement with database
    var icon;
    var color;
    getFavicons('github.com').then(data => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].sizes == '76x76')
                icon = data[i].src;
        }
    })
}

function loadData() {
    let data = [{
        icon: '',
        name: 'Reddit',
        count: 4560,
        color: '#5f99cf',
        url: ''
    }, {
        icon: '',
        name: 'ProductHunt',
        count: 500,
        color: '#00b27f',
        url: ''
    }, {
        icon: '',
        name: 'HackerNews',
        count: 2000,
        color: '#ff4000',
        url: ''
    }, {
        icon: '',
        name: 'Facebook',
        count: 64,
        color: '#3b5998',
        url: ''
    }]

    return data;
}