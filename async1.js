var async = require('async');

console.log('Program Start');

var async = require('async');
async.series([
    function (callback) {
        console.log('First Step --> ');
        callback(null, '1');
    },
    function (callback) {
        console.log('Second Step --> ');
        callback(null, '2');
    },
    function (callback) {
        console.log('third Step --> ');
        callback(null, '3');
    }
],
function (err, result) {
    console.log(result);
});

console.log('Program End');

/*
var create = function (varOne, varTwo) {
    async.waterfall([
        _function1(varOne),
        _function2,
        _function3
    ], function (error, success) {
        if (error) { alert('Something is wrong!'); }
        return alert('Done!');
    });
};

function _function1 (req) {
    return function (callback) {
        var something = req.body;
        callback (null, something);
   }
}

function _function2 (something, callback) {
    return function (callback) {
       var somethingelse = function () { // do something here };
       callback (err, somethingelse);
    }
}

function _function3 (something, callback) {
    return function (callback) {
      var somethingmore = function () { // do something here };
      callback (err, somethingmore);
    }
}

create(varOne, varTwo);


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

function baz(arg, callback) {
  if (arg < 0) {
    callback('error');
    return;
  }
  var arg3 = 'thrid';
  var arg2 = 'second';
  callback(null, arg);
}

async.waterfall([
  (cb) => {
    foo(0, cb);
  },
  (arg, cb) => {
    bar(arg, cb);
  },
  (arg, cb) => {
    baz(arg, cb);
  }
], (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result); //6
  }
});
*/