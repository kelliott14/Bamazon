require("dotenv").config();
var keys = require("./keys");
var password = keys.mySQL.password;

var mySQL = require("mysql");
var inquirer = require("inquirer");

var connection = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password : password,
    database : 'TopSongsDB'
  });

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId);
    
});