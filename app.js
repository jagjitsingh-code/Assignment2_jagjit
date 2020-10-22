/*
	Filename: app.js
	Name: Jagjit Singh
	Student ID: 301106044
	Date: 2020-09-29
*/

var port=process.env.PORT || 8080;
var express = require('express');
var session = require('express-session');
var app = express();

//Session for authentication
app.use(session({
	secret: '123456789',
	resave: false,
  	saveUninitialized: true
}));

var router=require('./routes/index.js');
app.set('view engine', 'ejs');

app.use("/",router);
app.use("/public", express.static(__dirname + '/public'));

app.listen(port);
console.log('Server is up and running at localhost:'+port);

module.exports=app