//import modules
const mysql = require("mysql");
const express = require("express");
const encoder = express.urlencoded();
const app = express();

//create connection details for database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

app.use(express.static(__dirname))

//Connect to database 
connection.connect(function(error){
    if (error) throw error
    else 
    {
        console.log("Connection Successful")
    }
});

//Send index.html
app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    connection.query("SELECT * from users where username = ? and password = ?",[username,password],function(error,results,fields){
        if(results.length > 0)
        {
            res.redirect("/capstone_website.html");
        }
        else
        {
            
            res.redirect("/");
           
        }
        res.end();
    })
})

//if successful send capstone_website.html
app.get("/capstone_website.html",function(req,res){
    res.sendFile(__dirname+"/capstone_website.html");
})

//set app port 
app.listen(4500);