var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3001;
var config = require('./config');
var udf = require('./utils/utilFunctions');
var connection = require('./connection');
var mongoose = require('mongoose');
var date = require('date-and-time');
var util = require('util');

//schema definition
var userSchema = require('./dbmodels/users');
var UserModel = mongoose.model('usersinfo', userSchema, 'users');

var user_transSchema = require('./dbmodels/user_transaction');
var UserhistoryModel = mongoose.model('users_historyinfo', user_transSchema, 'users_history');


var ErrorLogInterface = require('./common/errorLogger.js');

var sg = require('sendgrid')('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');
 
app.use(bodyParser.json());

mongoose.Promise = require('bluebird');
mongoose.connect(connection.connectionString, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  });

//Common functions
var LogError = function(error, moduleName)
{
    let errorlogger = ErrorLogInterface();
    let errorModel = {
      message: error.message,
      modulename: moduleName,
      errorStack: error.errorStack === undefined ?  JSON.stringify(error) : JSON.stringify(error.errorStack)
    }
    errorlogger.logError(errorModel);
}

app.post('/validateLogin', function(req, res)
{
	UserModel.findOne({userid: req.body.userid, Password: req.body.Password },{userid: true}, function(err,obj) { 
		console.log(obj); 
		if (obj != undefined) {
			res.json({ "success": true, "errormessage": "", data: obj });
		}
		else
		{
			res.json({ "success": false, "errormessage": "authentication mismatch or user doesnt exists in the system" });
		}		
	
	});
});

app.post('/createUser', function(req, res)
{
	try {
		
		var userdata = req.body;

		var userInfo = new UserModel(userdata);

		UserModel.findOne({userid: userdata.userid}, function(err,obj) { 
			console.log(obj); 
			if (obj == undefined) {
				userInfo.save(function (err) {
					if (err) {
						LogError(err, "createUser");
						res.status(400).send(err);
					}
					else { res.json({ "success": true, "errormessage": "" }); }
				});	
			}
			else
			{
				res.json({ "success": false, "errormessage": "userid already exists in the system" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "createUser");
	}
});


app.post('/UpdateDeposit', function(req, res)
{
	UserModel.findOne({userid: req.body.userid}, function(err,obj) { 
		console.log(obj); 
		if (obj != undefined) {
			let newBalance;
			if (req.body.reqtype == "Deposit") {
				newBalance = obj.Balance + req.body.reqbalance;
			}
			else
			{
				if (obj.Balance > 0 && obj.Balance >= req.body.reqbalance) {
					newBalance = obj.Balance - req.body.reqbalance;	
				}				
				else
				{					
					res.json({ "success": false, "errormessage": "In-sufficient balance for userid" });
					return false;
				}
			}
			
			let updateQuery = {
				"$set": {
					'Balance': newBalance
				}
			};
		
			UserModel.findOneAndUpdate({userid: req.body.userid}, updateQuery, function(err, doc){
				if(err){
					LogError(err, "UpdateDeposit");
				}
				let userhistorydata = {
					"userid" : req.body.userid,
					"Balance" : req.body.reqbalance,
					"Balance_Type": req.body.reqtype
				}
				let userHistoryInfo = new UserhistoryModel(userhistorydata);
				userHistoryInfo.save(function (err) {
					if (err) {
						LogError(err, "UpdateDeposit_history_save");						
					}
					
				});	
			
				res.json({ "success": true, "errormessage": "" });
			});						
		}
		else
		{
			res.json({ "success": false, "errormessage": "userid doesnt exists in the system" });
		}	
	
	});		
});







var Port = process.env.PORT || config.Port;
app.listen(Port);
console.log("server running on port " + Port);