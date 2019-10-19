require("dotenv").config();
var keys = require("./keys");
var password = keys.mySQL.password;

var mySQL = require("mysql");
var inquirer = require("inquirer");

function Department(department_id, department_name, over_head_costs, product_sales){
    this.department_id = department_id,
    this.department_name = department_name,
    this.over_head_costs = over_head_costs,
    this.product_sales = product_sales,
    this.total_profit = function(){
         return this.total_profit = this.product_sales - this.over_head_costs
    }
}

var table = [];

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
                viewProductSales();
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

function viewProductSales(){
    connection.query("SELECT * FROM bamazon_db.departments", function(err, results){
        
        results.forEach(function(item, index){
            var newDepartment = new Department(item.department_id, item.department_name, item.over_head_costs, item.product_sales)
            newDepartment.total_profit();
            table.push(newDepartment)
        })

        console.table(table)
    })
}