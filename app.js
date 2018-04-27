var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require("connect-flash");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

var connection = mysql.createConnection({
    host: "localhost",
    user: "szyyn95",
    database: "join_us",
    multipleStatements: true
});

app.use(function(req, res, next){
    res.locals.cur_user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});

var create_dummy = false;
if (create_dummy){
    var createDummy = require("./create_dummy");
    createDummy();
}

app.get("/", function(req, res){
    var query = "SELECT COUNT(*) AS count FROM users; SELECT COUNT(*) AS count FROM donations; SELECT TRUNCATE(SUM(donation_amount), 2) AS sum FROM donations;";
    connection.query(query, function(error, results, fields){
        if (error){
            throw error;
        }
        else{
            res.render("homepage.ejs", {num_users: results[0][0].count, num_donations: results[1][0].count, donation_amount: results[2][0].sum});
        }
    });
});

app.get("/donate", function(req, res){
    res.render("donate.ejs");
});

app.get("/leaderboard", function(req, res){
    res.render("leaderboard.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated");
});                                                                 