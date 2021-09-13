//import modules
const mysql = require("mysql");
const express = require("express");
const encoder = express.urlencoded();
const upload = require('express-fileupload');
const app = express();

//create connection details for database
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

app.use(express.static(__dirname))

//Connect to database 
db.connect(function(error){
    if (error) throw error
    else 
    {
        console.log("Connection Successful")
        
    }
});


var username;
var password;
//POST for login form
app.post("/",encoder, function(req,res){
    username = req.body.username;
    password = req.body.password;
    db.query("SELECT * from users where username = ? and password = ?",[username,password],function(error,results,fields){
        if(results.length > 0)
        {
            console.log(username);
            res.redirect("/capstone_website.html");
            console.log("Login Successful")
        }
        else
        { 
            res.redirect("/");
           
        }
        res.end();
    })
})
//POST for creating a new account 
app.post('/register', encoder,function(req,res){
    username = req.body.username;
    password = req.body.password;
    db.query("INSERT INTO users (username, password) VALUES (?,?)",[username, password],function(error,results){
        if(error) throw error;
        res.redirect("/index.html");
        console.log("Account Created");
    })
})
//POST for booking form 
app.post('/book',encoder,function (req, res) {
    var email = req.body.email;
    var date = req.body.date;
    var message = req.body.message;
    console.log(email);
    db.query("INSERT INTO bookings (email,date,message) VALUES (?,?,?)",[email,date,message],function(error,results){
        if (error) throw error;
    res.redirect("/booking.html");
        
  })
})
app.use(upload());
app.get('/upload', (req,res) =>{
    res.sendFile(__dirname +'/upload.html')
})
app.post('/upload',(req,res) =>
{
    if(req.files){
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name
        console.log(filename);
        file.mv('upload/'+filename,function(err){
            if(err){
                res.send(err);
            }
            else{
                console.log("File uploaded: "+filename);
            }
        })
    }
})

app.listen(4500);