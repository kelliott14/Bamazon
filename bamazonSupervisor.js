require("dotenv").config();
var keys = require("./keys");
var password = keys.mySQL.password;

var mySQL = require("mysql");
var inquirer = require("inquirer");

var addItem;
var addQty;

var connection = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password : password,
    database : 'bamazon_db'
  });

  connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId); 
});

start();

function start(){
    console.log("\n--------MAIN MENU: MANAGER VIEW------------\n");
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "How can I help you today?",
            choices: ["View Product Sales by Department", "Create New Departmenty", "Exit"]
        }
    ]).then(function(answer){
        switch (answer.command){
            case "View Product Sales by Department":
                viewAllProducts();
            break

            case "Create New Department":
                viewLowInventory();
            break

            case "Exit":
                console.log("\n\n\nExiting Bamazon Supervisor View...");
                connection.end();
        }
    })
};
