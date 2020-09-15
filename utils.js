
function log(msg,filename = "utils.js") {

    const curdate = new Date();
    const prefix = `[${curdate.getFullYear()}-${curdate.getMonth()}-${curdate.getDay()} ${curdate.getHours()}:${curdate.getMinutes()}:${curdate.getSeconds()}] {${filename}}: `;
    console.log(prefix + msg.replace(/\n/g, "\n" + prefix));
}

module.exports = {
    "log": log
};