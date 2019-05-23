const mongoose = require('mongoose');

const Query = mongoose.Schema({
  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  subject: {
    type: String,
    require: true
  },
  message: {
    type: String,
    require: true
  }
});

const UserQuery = mongoose.model('query', Query);

module.exports = UserQuery;
