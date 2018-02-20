/**
 * Created by Sandeep on 23 Jan 2018.
 */
//exports.connectionString= "mongodb://localhost:27017/test";

var environment = 'Dev';
var dbconnection='';
if(environment==='Dev') {
    dbconnection ='mongodb://betuser:betuser@ds125048.mlab.com:25048/betapp'
}
else
{
    dbconnection='';
}
exports.connectionString= dbconnection;
 