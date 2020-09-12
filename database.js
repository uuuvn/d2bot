/*
    database.js
    SQLite db helper
    Author: uuuvn
*/
let sqlite3 = require('sqlite3').verbose();

let db;


// This function create db structure
function createStructure() {
    
}
// This function init database
function init() {
    db = new sqlite3.Database('./database.sqlite');
    createStructure();
}



module.exports.init = init;