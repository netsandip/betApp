/*var foo = function (arg) {
     return new Promise((resolve, reject) => {
          resolve(arg+1);
     });
}

var bar = function (arg) {
     return new Promise((resolve, reject) => {
          resolve(arg+2);
     });
}

var baz = function (arg) {
     return new Promise((resolve, reject) => {
          resolve(arg+3);
     });
}

var log = function (arg) {
      console.log(arg);    
}

foo(5)
     .then(bar)
     .then(baz)
     .then(log);
	 
	 
	 

var first = function(arg1, arg2) {
	console.log(arg1, arg2);
	return new Promise((resolve, reject) => {
		var arg3 = 'thrid';
		resolve(arg1, arg2, arg3);
	});
}

var second = function(arg1, arg2) {
	console.log(arg1, arg2);
}



first("this1", "test")
				.then(second);
				
				
				*/
				
/*
				var async = require('async');
				
function foo(arg, callback) {
  if (arg < 0) {
    callback('error');
    return;
  }  
  callback(null, arg+1);
}

function bar(arg, callback) {
  if (arg < 0) {
    callback('error');
    return;
  }
  var arg2 = 'this';
  callback(null, arg+2, arg2);
}

function baz(arg,arg2, arg3, callback) {
  if (arg < 0) {
    callback('error');
    return;
  }
  var arg3 = 'thrid';
  var arg2 = 'second';
  callback(null, arg+3, arg2, arg3);
}

async.waterfall([
  (cb) => {
    foo(0, cb);
  },
  (arg, arg2, cb) => {
    bar(arg, arg2, cb);
  },
  (arg, arg2, arg3, cb) => {
    baz(arg, arg2, arg3, cb);
  }
], (err, result, arg2, arg3) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result); //6
  }
});

*/

var topVar = ' this ';
var anotherVar;

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var foo = async (function() {
    var resultA = await (firstAsyncCall());
    var resultB = await (secondAsyncCallUsing(resultA));
    var resultC = await (thirdAsyncCallUsing(resultB));
    return doSomethingWith(resultC);
});


var firstAsyncCall = function()
{
	console.log("1");

	return await topVar + 'test ';
}

var secondAsyncCallUsing = function(first)
{
	console.log("2");
	anotherVar = 'anotherVarTest';
	return first + 'secnond ';
}


var thirdAsyncCallUsing = function(second)
{
	console.log("3");
	return second + 'third' + topVar;
}

var doSomethingWith = function(finale)
{
	console.log("4");
	console.log(finale + anotherVar);
}

foo();

/*
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs')); // adds Async() versions that return promises
var path = require('path');
var _ = require('lodash');

var countFiles = async (function (dir) {
    var files = await (fs.readdirAsync(dir));
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = await (_.map(paths, function (path) { return fs.statAsync(path); })); // parallel!
    return _.filter(stats, function (stat) { return stat.isFile(); }).length;
});

// Give it a spin
countFiles(__dirname)
    .then (function (num) { console.log('There are ' + num + ' files in ' + __dirname); })
    .catch(function (err) { console.log('Something went wrong: ' + err); });

*/