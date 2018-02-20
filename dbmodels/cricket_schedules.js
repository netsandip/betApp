//mongoose schema for getting data  

var mongoose = require('mongoose');
module.exports = mongoose.Schema({
    matches: String,
    Created_date : { type : Date, default: Date.now }
});
