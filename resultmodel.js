//mongoose schema for getting data  

var mongoose = require('mongoose');
module.exports = mongoose.Schema({
    NA_ : String,
    Seq_No : Number,
    Event_Date : String,
    Event_Time : String,
    Card_No : Number,
    Acess_Zone : String,
    Access_Type : String,
    Number_Hours : Number,
    Temporal_Pattern : String,
    Date_Time : Date,
    Exceeds_9PM : String,
    Diff_EventTime : Number,
    Door_Zone : String,
    Displacement_Pattern : String,
    DiffUnAuth : String,
    Diff_AUN_RES : String,
    Long_Time_No_exit : String,
    Out_Pattern : String,
    NoExit_Hours : Number
});
