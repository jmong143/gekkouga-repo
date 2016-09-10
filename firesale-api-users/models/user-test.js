// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var categorySchema = new Schema({
  username: { type: String, required: true},
  fullname: { type: String},
  create_date: {type: Date, default: Date.now}
});

var Category = mongoose.model('users', categorySchema);
module.exports = Category;
