var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();
var connection = mysql.createConnection({
    host: "localhost",
    user: "szyyn95",
    database: "join_us"
});

var create_dummy = false;
if (create_dummy){
    var createDummy = require("./create_dummy");
    createDummy();
}

var query = "SELECT * FROM users LIMIT 5";
connection.query(query, function(error, results, fields){
    if (error){
        throw error;
    }
    console.log(results);
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated");
});                                                                 