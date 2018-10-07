#!/usr/bin/env node
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var getFavicons = require('get-website-favicon')
var URL = require('url');
var ipToInt = require('ip-to-int');

var config = require('./config.'+process.env.NODE_ENV+'.js');
var connection;

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

app.get('/stats', async (req, res) => {
    connection = mysql.createConnection(config.db);
    data = await loadData();
    connection.end();
    res.send(data);
})

/* final catch-all route to index.html defined last */
app.get('/', async (req, res) => {
    connection = mysql.createConnection(config.db);
    referrer = await getSource(req);
    await createOrIncrementSource(referrer);
    await registerVisitor(req.ip, referrer);
    connection.end();
    res.sendFile(__dirname + '/src/index.html');
})

httpServer.listen(config.app.port, config.app.ip, function() {
    console.log('listening on ' + config.app.ip + ':' + config.app.port);
});
/*httpsServer.listen(config.app.securePort, config.app.ip, function() {
    onsole.log('listening on ' + config.app.ip + ':' + config.app.securePort);
});*/

async function getSource(req) {
    // Has to return url of website
    let referrer;
    
    // First check if referrer header is set
    // If it is, then referrer is url
    if (req.headers.referrer) {
        referrer = req.headers.referrer;
    }
    // If it isn't parse url, and hope to get ?ref= or ?utm_source
    else if (req.url) {
        if (req.query.ref) {
            ref = await loadReferrer(req.query.ref);
            if (ref) {
                referrer = ref.url;
            } else if (req.query.ref.includes('www.')) {
                referrer = req.query.ref;
            }
        }
        if (!referrer && req.query.utm_source) {
            referrer = req.query.utm_source;
        }
    }
    if (!referrer) {
        referrer = 'unknown';
    }
    if (referrer.startsWith('www')) {
        referrer = 'https://' + referrer;
    }
    return referrer;
}

async function loadReferrer(referrer) {
    let promise = new Promise((resolve, reject) => {
        let sql = "SELECT * FROM sources where url ="+mysql.escape(referrer);
        connection.query(sql, (err, res, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        });
    });

    return promise;
}

async function createOrIncrementSource(referrer) {
    // Increment count of visits from this particular referrer
    let updated = await incrementReferrer(referrer);
    if (!updated)
        await createReferrer(referrer);
    
}

async function incrementReferrer(referrer) {
    let promise = new Promise((resolve, reject) => {
        let sql = "UPDATE sources SET count = count + 1 WHERE url="+mysql.escape(referrer);
        connection.query(sql, (err, res, fields) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res.affectedRows);
            }
        });
    });

    return promise;
}

async function createReferrer(referrer) {
    let promise = new Promise((resolve, reject) => {
        let stmt = 'INSERT INTO sources (name, count, color, textcolor, url, icon) ' +
            'VALUES (?, ?, ?, ?, ?, ?)';
        let url = URL.parse(referrer, true);
        let name = url.hostname || 'Unknown';
        let count = 1;
        let color = '#afafaf';
        let textcolor = '#ffffff';
        let icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/240px-Icon-round-Question_mark.svg.png';
        let values = [name, count, color, textcolor, referrer, icon];
        connection.query(stmt, values, (err, res, fields) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });

    return promise;
    // var icon;
    // var color;
    // getFavicons('github.com').then(data => {
    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].sizes == '76x76')
    //             icon = data[i].src;
    //     }
    // })
}

async function registerVisitor(ip, referrer) {
    let promise = new Promise((resolve, reject) => {
        let stmt = 'INSERT INTO visit (ip, referrer) VALUES (?, ?)';
        let ipInt = ipToInt(ip).toInt();
        let values = [ipInt, referrer];
        connection.query(stmt, values, (err, res, fields) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(res);
        });
    });

    return promise;
}

async function loadData() {
    let promise = new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM sources ORDER BY count DESC';
        connection.query(sql, (err, res, fields) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(res);
        });
    });

    return promise;
}