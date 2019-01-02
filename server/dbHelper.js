const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
/*
Helper for constructing Data Base
 */
const defaultItem = {users:[{username:'', password:'', uuid: '', session:''}], media:[{cover:'', isDone: false, media:'', desc:'',title:''}]};

db.defaults(defaultItem)
    .write();

module.exports = db;
