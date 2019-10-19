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
    console.log("\n--------MAIN MENU: MANAGER VIEW------------\n");
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "How can I help you today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer){
        switch (answer.command){
            case "View Products for Sale":
                viewAllProducts();
            break

            case "View Low Inventory":
                viewLowInventory();
            break

            case "Add to Inventor":
                buyItems()
            break

            case "Add New Product":
                buyItems()
            break

            case "Exit":
                console.log("\n\n\n\n\n\nExiting Bamazon Manger View...");
                connection.end();
        }
    })
};

function viewAllProducts(){
    
        connection.query("select * from bamazon_db.products order by department_name", function(err, results){
            if (err) throw err;
            console.log("\n-----ITEM LIST-----")
            results.forEach(function (item, index){
                console.log("Item: " + item.item_id + 
                " | Category: " + item.department_name +
                " | Product: " + item.product_name + 
                " | Qty on Hand: " + item.stock_quantity + 
                " | Price: $" + item.price);
            })
            console.log("-------------------")
            viewAllProductsAgain();
        })
}

function viewAllProductsAgain(){
    inquirer.prompt([
        {
            name: "nextCommand",
            message: "Where to next?",
            choices: ["View Products Again", "Main Menu"],
            type: "list"
        }
    ]).then(function(answer){
        switch (answer.nextCommand){
            case "View Products Again":
                viewAllProducts();
                break
                
                case "Main Menu":
                    start();
        }
    })
}

function viewLowInventory(){
    connection.query("select * from bamazon_db.products group by stock_quantity having stock_quantity < 5;", function(err, results){
            if (err) throw err;
            
            if(results.length == 0){
                console.log("\nAll products have more than 5 items in stock.\n")
                viewLowInventoryAgain()
            }else{
                console.log("\n-----LESS THAN 5 ITEMS IN STOCK-----")
                results.forEach(function (item, index){
                    console.log("Item: " + item.item_id + 
                    " | Category: " + item.department_name +
                    " | Product: " + item.product_name + 
                    " | Qty on Hand: " + item.stock_quantity + 
                    " | Price: $" + item.price);
                })
                console.log("-------------------")
                viewLowInventoryAgain();
            }
        });    
}

function viewLowInventoryAgain(){
    inquirer.prompt([
        {
            name: "nextCommand",
            message: "Where to next?",
            choices: ["View Low Inventory Again", "Main Menu"],
            type: "list"
        }
    ]).then(function(answer){
        switch (answer.nextCommand){
            case "View Low Inventory Again":
                viewLowInventory();
                break
                
                case "Main Menu":
                    start();
        }
    })
}