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