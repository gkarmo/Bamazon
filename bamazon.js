var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "deddeh13",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the user
    shop();
  });

  function shop() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "inventory",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
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
            // based on their answer, either call the bid or the post functions
            if (answer) {
              postAuction();
            }
            else if(answer.postOrBid === "BID") {
              bidAuction();
            } else{
              connection.end();
            }
          });
        });
    }