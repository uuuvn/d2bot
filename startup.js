/*
    startup.js
    Main file
    Author: uuuvn
*/
const db = require("./database.js");


//Functions

function init() {
    db.init()
}

init();