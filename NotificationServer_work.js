var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3001;
var gcm = require('node-gcm');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var cradle = require('cradle');
var connection = new(cradle.Connection)('https://ashokustglobal.cloudant.com', 443, {
      auth: { username: 'ashokustglobal', password: 'ashokUstGlobal@1234' }
  });
  
var registrationDB = connection.database('registration');
var testDB = connection.database('test');
var notificationsDB = connection.database('notifications');

var FCMServerKey = 'AAAAFaQMFOM:APA91bFR3I1IxRx0hUzjR0EMGmyl8NScv-YhFd8acmneiPMrBXZTCOsptDBM4NucGmRj7jOOCrkxo0dZ8E2x7uKW3wvUSfJcM5q9AEn41M9A_4gvtlwXRCElPcY5-jCipt1BiGjSY0Q9';
var AID_REQUEST_ORDER_SELF_PICKUP = 'AID_REQUEST_ORDER_SELF_PICKUP';
var SITE_CONFIRM_ORDER_SELF_PICKUP = 'SITE_CONFIRM_ORDER_SELF_PICKUP';
var AID_REQUEST_ORDER_SHIPMENT = 'AID_REQUEST_ORDER_SHIPMENT';
var SITE_CONFIRM_ORDER_SHIPMENT = 'SITE_CONFIRM_ORDER_SHIPMENT';
var SITE_SELFPICKUP_COMPLETE = 'SITE_SELFPICKUP_COMPLETE';
var SITE_SHIPMENTPICKUP_COMPLETE = 'SITE_SHIPMENTPICKUP_COMPLETE';

var sg = require('sendgrid')('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');

var AID_REQUEST_ORDER_SELF_PICKUP_MSG = 'You have Order, that is interested by MSRO user, Wants to self pickup';
var SITE_CONFIRM_ORDER_SELF_PICKUP_MSG = 'Your order request is confirmed for self pickup. Self pickup slots and locations are available in MAP';
var AID_REQUEST_ORDER_SHIPMENT_MSG = 'You have Request for shipment on the Post advertised';
var SITE_CONFIRM_ORDER_SHIPMENT_MSG = 'Order# is requested for Shipment';
var SITE_SELFPICKUP_COMPLETE_MSG = 'Self pickup for {DocID} is completed. You can see your completed orders in navigation menu';
var SITE_SHIPMENTPICKUP_COMPLETE_MSG = 'Shipment pickup is completed, your oder will be delivered as per shipment transaction, Tracking order is #';

var date = require('date-and-time');
 
app.use(bodyParser.json());

app.post('/resetpassword', function(req, postres){
	try
	{		
		var emailid = req.body.emailID;			
		var found = false;
		registrationDB.view('vregistration/byemailid', { key: emailid },function (err, doc) {		
		  try {			  
			  if(doc.length > 0)
			  row = doc[0].value; 	
			  else {
				  postres.status(200).send({ status: 'Failure', message: 'User not found!' });
				  return;
			  }
			  if (row.email_ID.toUpperCase() === emailid.toUpperCase())
				{					
					found = true;
					var validOTP = "";
					var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					for (var i = 0; i < 5; i++)
					{
						validOTP += possible.charAt(Math.floor(Math.random() * possible.length));
					}				
															
					registrationDB.merge(row._id, {
							  pass_verficationCode: validOTP
						  }, function (err, res) {
								if (err) {
									console.log(err.stack) //audit-log
									postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
									return;
								}									
							  
								// start Add by e-mail code 
								var request = sg.emptyRequest({
								method: 'POST',
								path: '/v3/mail/send',
								body: {
									personalizations: [
									{
										to: [
										{
											email: emailid
										}
										],
										subject: 'Kits4Life - Forgotten password reset'
									}
									],
									from: {
									email: 'kits4life.support@ust-global.com'
									},
									content: [
									{
										type: 'text/html',
										value: 'Dear '+ emailid +', <br /><br /> You recently requested to reset your password for your Kits4life Account. Use OTP to reset your password.:-  ' + validOTP + ' <br /><br /> If you did not request a password reset, please ignore this email or send email to kits4life.support@ust-global.com to let us know. This password reset is only valid for next 1 day.' + 
			 ' <br /><br /><br /> Thanks, <br /> Kits4life support Team, <br /> kits4life.support@ust-global.com.'
									}
									]
								}
								});

								sg.API(request, function (error, response) {
								if (error) {
									console.log('Error response received');
								}
									console.log(response.statusCode);
									console.log(response.body);
									console.log(response.headers);
									postres.send({ status: 'Success' });
								});

						  });					
				}			  		 
			}
		catch (err) {
			console.log(err.stack);
			postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
			return;
			}
			if (!found)
				postres.status(200).send({ status: 'Failure', message: 'User not found!' });
      });  
		
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
});

app.post('/validateresetpassword', function(req, postres){
	try
	{
		var emailid = req.body.emailID;			
		var otpCode = req.body.otpCode;
		var valid = false;
		registrationDB.view('vregistration/byemailid', { key: emailid }, function (err, doc) {
				if(doc.length > 0)
				  row = doc[0].value; 	
				  else {
					  postres.status(200).send({ status: 'Failure', message: 'User not found!' });
					  return;
				}
				if (row.email_ID.toUpperCase() === emailid.toUpperCase() && row.pass_verficationCode.length > 0 && otpCode !== undefined)
				{					
					if(row.pass_verficationCode === otpCode)
					{
						valid = true;
						postres.status(200).send({ status: 'Success' });						
					}					
				}					
			
			if (!valid)
				postres.status(200).send({ status: 'Failure', message: 'invalid OTP verification code!' });
				
		});
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
		
});


app.post('/changepassword', function(req, postres){
	try
	{
		var emailid = req.body.emailID;			
		var npasswod = req.body.newpassword;
		var found = false;
		registrationDB.view('vregistration/byemailid', { key: emailid }, function (err, doc) {
			if(doc.length > 0)
				  row = doc[0].value; 	
				  else {
					  postres.status(200).send({ status: 'Failure', message: 'User not found!' });
					  return;
				}
				if (row.email_ID.toUpperCase() === emailid.toUpperCase())
				{
					found = true;
						registrationDB.merge(row._id, {
							  password: npasswod
						  }, function (err, res) {
								if (err) {
									console.log(err.stack) //audit-log
									postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
									return;
								}																
							  
								// start Add by e-mail code 
								var request = sg.emptyRequest({
								method: 'POST',
								path: '/v3/mail/send',
								body: {
									personalizations: [
									{
										to: [
										{
											email: emailid
										}
										],
										subject: 'Kits4Life - change password notification'
									}
									],
									from: {
									email: 'kits4life.support@ust-global.com'
									},
									content: [
									{
										type: 'text/html',
										value: 'Dear '+ emailid +', <br /><br /> You recently requested to change  password for your Kits4life Account. <br /><br /> If you did not request a password reset, please ignore this email or send email to kits4life.support@ust-global.com to let us know. This password reset is only valid for next 1 day.' + 
			 ' <br /><br /><br /> Thanks, <br /> Kits4life support Team, <br /> kits4life.support@ust-global.com.'
									}
									]
								}
								});

								sg.API(request, function (error, response) {
								if (error) {
									console.log('Error response received');
								}
									console.log(response.statusCode);
									console.log(response.body);
									console.log(response.headers);									
								});

						  });
						  postres.status(200).send({ status: 'Success' });						
				}				
			
			if (!found)
				postres.status(200).send({ status: 'Failure', message: 'User not found!' });
		});
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });;
	}
		
});


app.post('/retoldpassword', function(req,postres) {
	try
	{
		var emailid = req.body.emailID;			
		var found = false;
		registrationDB.view('vregistration/all', function (err, res) {
				res.forEach(function (row) {
				if (row.email_ID.toUpperCase() === emailid.toUpperCase())
				{
					found = true;
					postres.send({ status: 'Success', oldpassword: row.password });
				}				
			});
			if(!found)
				{					
					postres.status(200).send({ status: 'Failure', message: 'User not found!' });
				}
		});
		
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
});


app.post('/generateAuthCode', function (req, postres) {
	try
	{		
		var emailid = req.body.emailID;			
		var found = false;
		registrationDB.view('vregistration/byemailid', { key: emailid }, function (err, doc) {		
		  try {			  
			  if(doc.length > 0)
			  row = doc[0].value; 	
			  else {
				  postres.status(200).send({ status: 'Failure', message: 'User not found!' });
				  return;
			  }
			  if (row.email_ID.toUpperCase() === emailid.toUpperCase())
				{					
					found = true;
					var reqotp = "";
					var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					for (var i = 0; i < 5; i++)
					{
						reqotp += possible.charAt(Math.floor(Math.random() * possible.length));
					}				
															
					registrationDB.merge(row._id, {
							  reg_verficationCode: reqotp
						  }, function (err, res) {
								if (err) {
									console.log(err.stack) //audit-log
									postres.sendStatus(200);
								}																
							  
								// start Add by e-mail code 
								var request = sg.emptyRequest({
								method: 'POST',
								path: '/v3/mail/send',
								body: {
									personalizations: [
									{
										to: [
										{
											email: emailid
										}
										],
										subject: 'Kits4Life - Authorization code for MSRO registration'
									}
									],
									from: {
									email: 'kits4life.support@ust-global.com'
									},
									content: [
									{
										type: 'text/html',
										value: 'Dear '+ emailid +', <br /><br /> You recently registered for Kits4life Account. Use OTP to authorize your registration.:-  ' + reqotp + ' <br /><br /> If you did not request for registration, please ignore this email or send email to kits4life.support@ust-global.com to let us know. This password reset is only valid for next 1 day.' + 
			 ' <br /><br /><br /> Thanks, <br /> Kits4life support Team, <br /> kits4life.support@ust-global.com.'
									}
									]
								}
								});

								sg.API(request, function (error, response) {
								if (error) {
									console.log('Error response received');
								}
									console.log(response.statusCode);
									console.log(response.body);
									console.log(response.headers);									
								});

						  });	
						  postres.send({ status: 'Success' });						  
				}			  		 
			}
		catch (err) {
			console.log(err.stack);
			postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
			}
			if (!found)
				postres.status(200).send({ status: 'Failure', message: 'User not found!' });      
	}); 
		
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
	
});

app.post('/validateauthcode', function(req, postres){
	try
	{
		var emailid = req.body.emailID;			
		var reqAuthCode = req.body.reqAuthCode;
		var valid = false;
		registrationDB.view('vregistration/byemailid', { key: emailid }, function (err, doc) {
			if(doc.length > 0)
			  row = doc[0].value; 	
			  else {
				  postres.status(200).send({ status: 'Failure', message: 'User not found!' });
				  return;
			  }
			if (row.email_ID.toUpperCase() === emailid.toUpperCase() && row.reg_verficationCode.length > 0 && reqAuthCode !== undefined)
			{	
				if(row.reg_verficationCode === reqAuthCode)
				{
					valid = true;
				}					
			}

			if (!valid) {				
				postres.status(200).send({ status: 'Failure', message: 'invalid OTP verification code!' });
				return;
			}
			
			postres.status(200).send({ status: 'Success' });													
			});
			
	}
	catch (err)
	{
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
		
});

function GetUserByEmailID(emailID)
{
	var row;
	console.log("in 1");
	registrationDB.view('vregistration/byemailid', { key: emailID }, function (err, doc) {
		console.log("in 2");
		if(doc.length > 0)
		{
			console.log("found");
			row = doc[0].value; 	
			return await (row);
		}
		else 
		{
			  //postres.status(200).send({ status: 'Failure', message: 'User not found!' });
			  console.log("not found");
			  return undefined;
		}
	});
	console.log("in 3");
		
}

function generateNotify(foundSiteUser, foundAidUser){
	var isvalidNotification = false;
	if (foundSiteUser === undefined && foundAidUser === undefined)
	{
		console.log(foundSiteUser);
		console.log(foundAidUser);
		return isvalidNotification;
		//audit-log to tell either one of the users not found
	}
	
	switch(action)
	{
		case AID_REQUEST_ORDER_SELF_PICKUP:		
			isvalidNotification = SendActionNotificationMessage(AID_REQUEST_ORDER_SELF_PICKUP, AID_REQUEST_ORDER_SELF_PICKUP_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);	
			
			//postres.send({ status: 'SUCCESS' });
		break;
		
		case SITE_CONFIRM_ORDER_SELF_PICKUP:
			isvalidNotification = SendActionNotificationMessage(SITE_CONFIRM_ORDER_SELF_PICKUP, SITE_CONFIRM_ORDER_SELF_PICKUP_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);
			//postres.send({ status: 'SUCCESS' });
		break;
		
		case AID_REQUEST_ORDER_SHIPMENT:
			isvalidNotification = SendActionNotificationMessage(AID_REQUEST_ORDER_SHIPMENT, AID_REQUEST_ORDER_SHIPMENT_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);
			//postres.send({ status: 'SUCCESS' });
		break;
		
		case SITE_CONFIRM_ORDER_SHIPMENT:
			isvalidNotification = SendActionNotificationMessage(SITE_CONFIRM_ORDER_SHIPMENT, SITE_CONFIRM_ORDER_SHIPMENT_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);
			//postres.send({ status: 'SUCCESS' });
		break;
		
		case SITE_SELFPICKUP_COMPLETE:
			isvalidNotification = SendActionNotificationMessage(SITE_SELFPICKUP_COMPLETE, SITE_SELFPICKUP_COMPLETE_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);
			//postres.send({ status: 'SUCCESS' });
		break;
		
		case SITE_SHIPMENTPICKUP_COMPLETE:
			isvalidNotification = SendActionNotificationMessage(SITE_SHIPMENTPICKUP_COMPLETE, SITE_SHIPMENTPICKUP_COMPLETE_MSG, docID, foundSiteUser, foundAidUser, first_name, last_name);
			//postres.send({ status: 'SUCCESS' });
		break;						
	}
	
	return isvalidNotification;
}

app.post('/GenerateNotification', function(req,postres){
		
	try
	{
			console.log(req.body);
			var action = req.body.action;
			var docID = req.body.doc_id;
			var siteEmail = req.body.siteEmailID;
			var aidEmail = req.body.aidEmailID;
			var first_name = req.body.first_name;
			var last_name = req.body.last_name;
			var foundSiteUser;
			var foundAidUser;
			
			// async function executeAsyncTask () {
					// const valueA = await GetUserByEmailID(siteEmail)
					// const valueB = await functionB(valueA)
					// return function3(valueA, valueB)
			// }

			// async.series([
				// function (callback) {
					// console.log("1");
					// foundSiteUser = GetUserByEmailID(siteEmail);
					// console.log("2");
					// callback(null, foundSiteUser);
				// },
				// function (callback) {
					// foundAidUser = GetUserByEmailID(aidEmail);
					// callback(null, foundAidUser);
				// }
			// ],
			// function (err, result) {				
				// console.log(result);
				// if(result)
					// postres.status(200).send({ status: 'Success' });
				// else
					// postres.status(200).send({ status: 'Failure' });
			// });

			// ,
				// function (callback){
					// var isNotificationSent = generateNotify(foundSiteUser, foundAidUser);
					// callback(null, isNotificationSent);
				// }
			
			
			var asyncGenerateNotify = async (function() {
				var foundSiteUser = await (GetUserByEmailID(siteEmail));
				var foundAidUser = await (GetUserByEmailID(aidEmail));
				var isNotificationSent = await (generateNotify(foundSiteUser, foundAidUser));
				//return doSomethingWith(resultC);
			});
						
			asyncGenerateNotify()
						.then (function (isNotificationSent) { 
							if(isNotificationSent)
								postres.status(200).send({ status: 'Success' });
							else
								postres.status(200).send({ status: 'Failure' });
						})
						.catch(function (err) { 
								console.log('Something went wrong: ' + err);
								console.log('Something went wrong, stack: ' + err.stack);								//audit-log
								postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
								});
			
			
	}
	catch (err) {
		console.log(err.stack);
		postres.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}
	
	
});

app.listen(port, function(){
    console.log('app listening on port '+ port);
})

function SendActionNotificationMessage(action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name)
{ 		 
	let isNotification = false;
	try 
	{
		switch(action)
		{
			  case AID_REQUEST_ORDER_SELF_PICKUP:														
						SendMessage(siteEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);	
						isNotification = true;
				break;
				
				case SITE_CONFIRM_ORDER_SELF_PICKUP:												
						SendMessage(aidEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);													
						isNotification = true;
				break;
				
				case AID_REQUEST_ORDER_SHIPMENT:												
						SendMessage(siteEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);													
						isNotification = true;
				break;
				
				case SITE_CONFIRM_ORDER_SHIPMENT:												
						SendMessage(aidEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);													
						isNotification = true;
				break;
				
				case SITE_SELFPICKUP_COMPLETE:												
						SendMessage(aidEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);													
						isNotification = true;
				break;
				
				case SITE_SHIPMENTPICKUP_COMPLETE:												
						SendMessage(aidEmailID.refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name);													
						isNotification = true;
				break;			
		} 
		  
				 
	}
	catch (err) {
		console.log(err.stack);
		res.status(500).send({ status: 'Failure', message: 'Internal Server Error!' });
	}      
	
	return isNotification;
}

function SendMessage(refreshToken, action, action_msg, docid, siteEmailID, aidEmailID, first_name, last_name)
{
	var regTokens = [];
	// Set up the sender with your GCM/FCM API key (declare this once for multiple messages) 
	var sender = new gcm.Sender(FCMServerKey);
	let now = new Date();

	console.log('found here');
	if(refreshToken !== undefined && refreshToken.length > 0 && refreshToken !== null)
	{
			regTokens.push(refreshToken);
			// Specify which registration IDs to deliver the message to 
			//
			console.log(regTokens.length > 0);
			console.log(regTokens);
			if (typeof regTokens !== 'undefined' && regTokens.length > 0)
			{										
				// Prepare a message to be sent 
				var message = new gcm.Message({
					data: { action: action,
							action_msg: action_msg,
							doc_id: docid,
							siteEmail: siteEmailID,
							
							aidEmail: aidEmailID,
							first_name: first_name,
							last_name: last_name
					}
				});									
				
				// Actually send the message 
				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
					if (err) console.error("error "+err);
					else console.log(response);
				});
				
				//Entry to pushnotifications database				
				notificationsDB.save({
					notification_message: action_msg, 
					eventtimedate: date.format(now, 'YYYY/MM/DD HH:mm:ss'), 
					readflag: false, 
					post_docid: docid
				  }, function (err, res) {
					  // Handle response
					  if(err)
						  console.log(err.stack);
					  console.log("Post notification entry successfull for docid " + docid); // audit-log
				  });
				
				console.log("Message Sent Successfully");
			}
			else 
			{
				//Audit log - Say that siteEmail doesnt have registered device
				console.log("Email user doesnt have registered device " + docid); // audit-log
			}
	}
	else 
	{
		//Audit log - Say that siteEmail doesnt have registered device
		console.log("Email user doesnt have registered device " + docid); // audit-log
	}

}