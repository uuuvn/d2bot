/*
    File: utils.js

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
let path = require('path');


function _getCallerFile() {
    try {
        var err = new Error();
        var callerfile;
        var currentfile;


        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if (currentfile !== callerfile) return path.relative(__dirname, callerfile);
        }
    } catch (err) { }
    return undefined;

}


function log(msg, filename = _getCallerFile()) {
    msg = msg.toString();
    const curdate = new Date();
    const prefix = `[${curdate.getFullYear()}-${curdate.getMonth()}-${curdate.getDay()} ${curdate.getHours()}:${curdate.getMinutes()}:${curdate.getSeconds()}] {${filename}}: `;
    const readyMsg = prefix + msg.replace(/\n/g, "\n" + prefix)
    console.log(readyMsg);
}

module.exports = {
    "log": log,
    "warn": log
};