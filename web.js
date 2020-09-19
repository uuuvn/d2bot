const utils = require("./utils.js");
const fs = require("fs");
const express = require('express');
const https = require("https");
const cnfm = require("./confmngr.js");
const app = express();
utils.log("Initing web module...","web.js");
let privateKey;
let certificate;
try {
    utils.log("Loading ssl certs...","web.js");
    privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    certificate = fs.readFileSync('ssl/server.crt', 'utf8');
    utils.log("Loaded ssl certs!","web.js");
} catch (e) {
    utils.log("Error while loading ssl certs!\n" + e,"web.js");
    process.exit(0);
}
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);


app.get('/', function (req, res) {
    res.send('hello world')
})


function start() {
    utils.log("Starting server...","web.js");
    httpsServer.listen(cnfm.config.web.bind,()=>{utils.log("Server started!","web.js");}).on('error', e=>{utils.log("Error while listening on: " + cnfm.config.web.bind + "\n" + e,"web.js");process.exit(0);});
}

function end() {
    httpsServer.close();
}

module.exports = {
    "start": start,
    "close": end
}
utils.log("Web module inited!","web.js");