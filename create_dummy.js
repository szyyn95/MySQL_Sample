var faker = require("faker");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "szyyn95",
    database: "join_us"
});

// Insert dummy data
function createDummy(){
    for (var i = 0; i < 500; i++){
        var new_user = {email: faker.internet.email(), created_at: faker.date.past(), firstname: faker.name.firstName(), lastname: faker.name.lastName()};
        connection.query("INSERT INTO users SET ?", new_user, function(error, result){
            if (error){
                throw error;
            }
        });
    }
    
    for (var i = 0; i < 1000; i++){
        var new_transaction = {user_id: Math.floor(Math.random() * 500) + 1, donation_amount: Math.random() * 100};
        connection.query("INSERT INTO donations SET ?", new_transaction, function(error, result){
            if (error){
                throw error;
            }
        });
    }
}

module.exports = createDummy;