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
    database : 'bamazon_db'
  });

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId); 
});

start();

function start(){
    console.log("\n--------MAIN MENU------------\n");
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "How can I help you today?",
            choices: ["Browse", "Search by item_id", "Exit"]
        }
    ]).then(function(answer){
        switch (answer.command){
            case "Browse":
                browseShop();
            break

            case "Search by item_id":
                searchByID();
            break

            case "Exit":
                console.log("\n\n\n\n\n\nThanks for shopping at Bamazon!");
                connection.end();
        }
    })
};

function searchByID(){
    //needs validations for NaN
    inquirer.prompt([
        {
            name: "item_id",
            message: "Enter the item_id",
            type: "number"
        }
    ]).then(function(answer){
        connection.query("SELECT * FROM bamazon_db.products where item_id = " + answer.item_id, function(err, results){
            if (err) throw err;
            if(!results[0]){
                console.log("\nThat item_id doesn't exist...\n");
                searchAgain();

            }else{
                console.log("\n\n-----ITEM_ID: " + answer.item_id + "-----\n " +
                    results[0].item_id + " | " + results[0].product_name +
                    "\n Category: " + results[0].department_name + 
                    "\n Price: $" + results[0].price + "\n\n")
            searchAgain();
        }
        })
    });
}

function searchAgain(){
    inquirer.prompt([
        {
            name: "nextCommand",
            message: "Where to next?",
            choices: ["Search Again", "Main Menu"],
            type: "list"
        }
    ]).then(function(answer){
        switch (answer.nextCommand){
            case "Search Again":
                searchByID();
                break
                
                case "Main Menu":
                    start();
                }
            })
}