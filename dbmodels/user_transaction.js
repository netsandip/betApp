//mongoose schema for getting data  

var mongoose = require('mongoose');
module.exports = mongoose.Schema({
    userid: String,
    Balance: Number,
    Balance_Type: String,
    Created_date : { type : Date, default: Date.now }
});
