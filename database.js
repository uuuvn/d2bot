const utils = require('./utils');

/*
    database.js
    SQLite db helper
    Author: uuuvn
*/
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id TEXT,permission INT)");
    db.run("CREATE TABLE IF NOT EXISTS autochannel (id TEXT,name TEXT,userlimit INT)");

    function isOwner(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users where id=? AND permission=?", id, -1, (err, row) => {
                if (err) return reject(err);
                if (row) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    //This function return owners list
    function getOwners() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM users", (err, rows) => {
                if (err) return reject(err);
                let owners = [];
                rows.forEach(row => {
                    if (row.permission == -1) owners.push(row.id);
                });
                resolve(owners);
            })
        });
    }
    //This function add owner
    function addOwner(id, permission = -1) {
        return new Promise((resolve, reject) => {
            if (!id) return reject("id is undefined");
            db.get("SELECT * FROM users WHERE id = ?", id, (err, row) => {
                if (err) return reject(err);
                if(row)return resolve(id);
                db.run("INSERT INTO users (id,permission) VALUES (?,?)", id, permission, (err) => {
                    if (err) return reject();
                    resolve(id);
                })
            })
        });
    }
    function removeOwner(id) {
        return new Promise((resolve, reject) => {
            if (!id) return reject("id is undefined");
            db.run("DELETE FROM users WHERE id=?", id, (err) => {
                if (err) return reject();
                resolve(id);
            });
        });
    }
    function RegCategory(id, name, limit) {
        return new Promise((resolve, reject) => {
            if (!id) return reject("id is undefined");
            db.run("INSERT INTO autochannel (id,name,userlimit) VALUES (?,?,?)", id, name, limit, (err) => {
                if (err) return reject();
                resolve(id);
            })
        });
    }
    function IsRegistredCategory(id) {
        return new Promise((resolve, reject) => {
            if (!id) return reject("id is undefined");
            db.get("SELECT * FROM autochannel WHERE id = ?", id, (err, row) => {
                if (err) return reject(err);
                if (row) {
                    resolve({bool: true,name: row.name.toString(),limit: row.userlimit.toString()});
                } else {
                    resolve({bool: false});
                }
            })
        });
    }

    module.exports = {
        "getOwners": getOwners,
        "addOwner": addOwner,
        "removeOwner": removeOwner,
        "isOwner": isOwner,
        "RegCategory": RegCategory,
        "IsRegistredCategory": IsRegistredCategory
    };
});