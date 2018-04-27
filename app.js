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
            req.flash("error", error.sqlMessage);
            res.redirect("back");
        }
        else{
            res.render("homepage.ejs", {num_users: results[0][0].count, num_donations: results[1][0].count, donation_amount: results[2][0].sum});
        }
    });
});

app.post("/", check_valid_email, function(req, res){
    var new_user = {email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname};
    connection.query("INSERT INTO users SET ?", new_user, function(error, result){
        if (error){
            req.flash("error", error.sqlMessage);
            res.redirect("back");
        }
        else{
            req.flash("success", "Welcome!");
            res.redirect("/");
        }
    });
});

app.get("/donate", function(req, res){
    res.render("donate.ejs");
});

app.post("/donate", check_valid_amount, function(req, res){
    var query = "SELECT COUNT(*) AS count, id FROM users WHERE email='" + req.body.email + "'";
    connection.query(query, function(error, results, fields){
        if (error){
            req.flash("error", error.sqlMessage);
            res.redirect("back");
        }
        else if (results[0].count == 0){
            req.flash("error", "This user doesn't exist!");
            res.redirect("back");
        }
        else{
            var new_donation = {user_id: results[0].id, donation_amount: req.body.amount};
            connection.query("INSERT INTO donations SET ?", new_donation, function(error, result) {
                if (error){
                    req.flash("error", error.sqlMessage);
                    res.redirect("back");
                }
                else{
                    req.flash("success", "Thanks for your donation!");
                    res.redirect("/");
                }
            });
        }
    });
});

app.get("/leaderboard", function(req, res){
    res.render("leaderboard.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated");
});                                                                 

function check_valid_email(req, res, next){
    var email = req.body.email;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())){
        return next();
    }
    else{
        req.flash("error", "Please use valid email address");
        res.redirect("back");
    }
}

function check_valid_amount(req, res, next){
    if (req.body.amount <= 0){
        req.flash("error", "Please input a valid amount");
        res.redirect("back");
    }
    else{
        return next();
    }
}