const utils = require("./utils.js");
try{
    module.exports.config = require("./config.json");
}catch(e){
    utils.log("Error while loading base configs!\n" + e);
    process.exit(0);
}