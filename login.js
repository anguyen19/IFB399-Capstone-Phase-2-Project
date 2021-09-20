//import modules
const mysql = require("mysql");
const express = require("express");
const encoder = express.urlencoded();
const upload = require('express-fileupload');
const app = express();
const pug = require('pug');

app.set('view engine', 'pug');
app.use(express.static('css'));
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

var currentUsername
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
            currentUsername = username;
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

app.post('/search', encoder,function(req,res)
{
    var result = req.body.searchWord
    db.query("Select * from bookings where instrument = (?)",[result],function(error, results)
    {
       if(results.length == 0)
       {
           console.log('not found')
           res.redirect('/search.html');
       }
       else
       {
           let resultsarray = []
           for(let i = 0; i < results.length; i++)
           {
                resultsarray.push(results[i]);
                console.log(resultsarray[i].instrument)
           }
           console.log(JSON.stringify(resultsarray));
           //resultsarray = JSON.stringify(resultsarray);
           console.log(resultsarray.length);
            res.render('search',{resultsarray: resultsarray});
       }
    });
})
//POST for booking form 
app.post('/book',encoder,function (req, res) {
    var email = req.body.email;
    var date = req.body.date;
    var instrument = req.body.instrument;
    var message = req.body.message;
    console.log(email);
    db.query("INSERT INTO bookings (email,date,instrument,message) VALUES (?,?,?,?)",[email,date,instrument,message],function(error,results){
        if (error) throw error;
    res.redirect("/booking.html");
        
  })
})

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