var connection = require('../connection.js');
var mongoose = require('mongoose');
var ErrorLogs = require('../dbmodels/errorlogmodel.js');
var ErrorInfo = mongoose.model('errorlogs', ErrorLogs, 'errorlogs');
mongoose.Promise = require('bluebird');
mongoose.connect(connection.connectionString, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  });

var methods = {};

var methods = {
	timestamp: function() {
		console.log('Current Time in Unix Timestamp: ' + Math.floor(Date.now() / 1000));
	},
	currentDate: function() {
		console.log('Current Date is: ' + new Date().toISOString().slice(0, 10));
    },
    Log: function(message,logType, errorStack)
    {
        // create a new user
        var logger = ErrorInfo({
            message: message,
            logtype: logType,
            errorStack: errorStack
        });
        
        // save the user
        logger.save(function(err) {
            if (err) throw console.log(err);			
        });
    }
};

exports.LogObject = methods;



