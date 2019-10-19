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

            case "Add to Inventory":
                addInventry();
            break

            case "Add New Product":
                addNewProduct()
            break

            case "Exit":
                console.log("\n\n\nExiting Bamazon Manger View...");
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

function addInventry(){
    inquirer.prompt([
        {
            name: "item_id",
            message: "Enter the item id of the product",
            type: "number",
        }
    ]).then(function (answer){
        
        addItem = answer.item_id;

        connection.query("SELECT * FROM bamazon_db.products WHERE item_id = " + answer.item_id, function(err, results){
            if(!results[0]){
                console.log("\nThat item id does not exist.\n");
                addInventoryAgain();
            }else{
                addQty = results[0].stock_quantity;

                console.log("\n--------------------------ITEM--------------------------" + 
                "\nItem: " + results[0].item_id + 
                " | Category: " + results[0].department_name +
                " | Product: " + results[0].product_name + 
                " | Qty on Hand: " + results[0].stock_quantity + 
                " | Price: $" + results[0].price + 
                "\n---------------------------------------------------------\n");

                inquirer.prompt([
                    {
                        name: "qty",
                        message: "Enter the amount of quantity you are adding",
                        type: "number"
                    }
                ]).then(function (answer){

                    connection.query("UPDATE bamazon_db.products SET ? WHERE?",
                    [{
                        stock_quantity: addQty + answer.qty
                    },
                    {
                        item_id: addItem
                    }]
                    );

                    console.log("Qty updated...")
                        
                    connection.query("SELECT * FROM bamazon_db.products WHERE item_id = " + addItem, function(err, results){
                        console.log("\n--------------------------ITEM--------------------------" + 
                        "\nItem: " + results[0].item_id + 
                        " | Category: " + results[0].department_name +
                        " | Product: " + results[0].product_name + 
                        " | Qty on Hand: " + results[0].stock_quantity + 
                        " | Price: $" + results[0].price + 
                        "\n---------------------------------------------------------\n")
                        addInventoryAgain();
                    });     
                });
            }
        });
    });
}

function addInventoryAgain(){
    inquirer.prompt([
        {
            name: "nextCommand",
            message: "Where to next?",
            choices: ["Add to Inventory Again", "Main Menu"],
            type: "list"
        }
    ]).then(function(answer){
        switch (answer.nextCommand){
            case "Add to Inventory Again":
                addInventry();
                break
                
                case "Main Menu":
                    start();
        }
    });
}

function addNewProduct(){
    inquirer.prompt([
        {
            name: "item_id",
            message: "Enter the item id of the product",
            type: "number"
        },
        {
            name: "product_name",
            message: "Enter the name of the product",
            type: "input"
        },
        {
            name: "department_name",
            message: "Enter the department name of the product",
            type: "input"
        },
        {
            name: "price",
            message: "Enter the price of the product",
            type: "number"
        },
        {
            name: "stock_quantity",
            message: "Enter the qty on hand of the product",
            type: "number"
        }
    ]).then(function (answer){
        addItem = answer.item_id
        connection.query("INSERT INTO bamazon_db.products SET ?",
        {
            item_id: answer.item_id,
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
        })
        console.log("Product added...")

        connection.query("SELECT * FROM bamazon_db.products WHERE item_id = " + addItem, function(err, results){
            console.log("\n--------------------------ITEM--------------------------" + 
            "\nItem: " + results[0].item_id + 
            " | Category: " + results[0].department_name +
            " | Product: " + results[0].product_name + 
            " | Qty on Hand: " + results[0].stock_quantity + 
            " | Price: $" + results[0].price + 
            "\n---------------------------------------------------------\n")
            addNewProductAgain();
        });     
    });
}

function addNewProductAgain(){
    inquirer.prompt([
        {
            name: "nextCommand",
            message: "Where to next?",
            choices: ["Add Another Product", "Main Menu"],
            type: "list"
        }
    ]).then(function(answer){
        switch (answer.nextCommand){
            case "Add Another Product":
                addNewProduct();
                break
                
                case "Main Menu":
                    start();
        }
    });
}