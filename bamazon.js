var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the user
    shop();
  });

  function shop() {
  // query the database for all items in inventory
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to purchase
    inquirer
      .prompt([
        {
          name: "inventory",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_id);
            }
            return choiceArray;
          },
          message: "What item would you like to purchase?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
        ])
        .then(function(answer) {
           
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].item_id === answer.inventory) {
                chosenItem = results[i];
              }
            }
                console.log(chosenItem)
            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {

                var new_quantity = chosenItem.stock_quantity - answer.quantity;

                console.log(new_quantity);
                
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: new_quantity
                    },
                    {
                      item_id: chosenItem.item_id
                    }
                  ],
                  function(error) {
                    if (error) throw err;
                    console.log("Thanks for shopping at Bamazon!");
                  }
                );
                connection.end()
              }
              else {
                // quantity wasn't high enough, so apologize and start over
                console.log("Sorry we do not have that much in stock.");
                shop();
              }
          });
        });
    }