const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let conn = 'mongodb://localhost:27017/club'
mongoose.connect(conn,{useNewUrlParser:true});

module.exports = mongoose;