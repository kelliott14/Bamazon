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
var addDepartment;

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

console.log("\n--------MAIN MENU: MANAGER VIEW------------\n");
start();

function start(){
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "How can I help you today?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(answer){
        switch (answer.command){
            case "View Product Sales by Department":
                viewProductSales();
            break

            case "Create New Department":
                createNewDepartment();
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

        start();
    })
}

function createNewDepartment(){
    inquirer.prompt([
        {
            name: "department_id",
            message: "Enter the id of the department",
            type: "number"
        },
        {
            name: "department_name",
            message: "Enter the name of the department",
            type: "input"
        },
        {
            name: "over_head_costs",
            message: "Enter the department's over head costs",
            type: "number"
        }
    ]).then(function (answer){
        addDepartment = answer.department_id
        connection.query("INSERT INTO bamazon_db.departments SET ?",
        {
            department_id: answer.department_id,
            department_name: answer.department_name,
            over_head_costs: answer.over_head_costs,
            product_sales: 0
        })
        console.log("\nDepartment added. Use Manager view to add products to department.\n")

        viewProductSales();     
    });
}
