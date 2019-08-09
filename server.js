var mysql = require('mysql');
var axios = require('axios');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'summer051597',
  database : 'bamazon_db'
});
 
connection.connect(function(err){
  if(err) throw err;

  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;

    //PRINT TABLE
    console.table(results);

    //START QUESTIONS
    inquirer.prompt([
      {
        type: 'input',
        message: 'What product you would like to buy (id)',
        name: 'id'
      },
      {
        type: 'input',
        message: 'How many products would you like to buy?',
        name: 'quantity'
      }
    ]).then(function (response) {
      var id = response.id;
      var quantity = response.quantity;
      console.log('id of the product is ' + id)
      console.log('quantity of the product is ' + quantity)
      getPurchase(id, quantity)
    })
  });
});
 


function getPurchase(id, quantity){
  connection.query('SELECT * FROM products WHERE item_id = ?', [id], function(error, res){
    // console.table(res)
    if(error) throw error;
    var currentQuantity;
    var cost; 
    if (parseInt(quantity) > parseInt(res[0].stock_quantity) ){
      console.log('We do not have enough products')
    } else{
        currentQuantity = parseInt(res[0].stock_quantity) - parseInt(quantity);
        console.log(currentQuantity);
        cost = parseInt(res[0].price) * parseInt(quantity);
        console.log('Congrats your total is $ ' + cost + '.00');
        updateProductInfo(currentQuantity, id)
    }
  })
}


function updateProductInfo(currentQuantity, id){
connection.query(
  'UPDATE products SET stock_quantity=? WHERE item_id=?',
  [currentQuantity, id],
  function(err2, response2) {
    if(err2) throw err2;
      console.log('Product has been updated')
      connection.end();
  }
);
}
