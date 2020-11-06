/*
    File: web.js

    MIT License

    Copyright (c) 2020 uuuvn (Nikolay Voynilenko)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
const utils = require("./utils.js");
const fs = require("fs");
const express = require('express');
const https = require("https");
const cnfm = require("./confmngr.js");
const app = express();
utils.log("Initing web module...");
let privateKey;
let certificate;
try {
    utils.log("Loading ssl certs...");
    privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    certificate = fs.readFileSync('ssl/server.crt', 'utf8');
    utils.log("Loaded ssl certs!");
} catch (e) {
    utils.log("Error while loading ssl certs!\n" + e);
    process.exit(0);
}
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);


app.get('/', function (req, res) {
    res.send('hello world')
})


function start() {
    utils.log("Starting server...");
    httpsServer.listen(cnfm.config.web.bind,()=>{utils.log("Server started!");}).on('error', e=>{utils.log("Error while listening on: " + cnfm.config.web.bind + "\n" + e);process.exit(0);});
}

function end() {
    httpsServer.close();
}

module.exports = {
    "start": start,
    "close": end
}
utils.log("Web module inited!");