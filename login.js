//import modules
const mysql = require("mysql");
const express = require("express");
const encoder = express.urlencoded();
const upload = require('express-fileupload');
const app = express();
const pug = require('pug');
const { application } = require("express");
const { Http2ServerRequest } = require("http2");
const { Console } = require("console");
var resultsarray = []
 
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
            res.redirect("html/capstone_website.html");
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
        res.redirect("html/index.html");
        console.log("Account Created");
    })
})
app.post('/update',encoder,function(req,res){
    var fullName = req.body.fullName;
    var email = req.body.email;
    var phone = req.body.phone;
    var currentPassword = req.body.password;
    var newPassword = req.body.passwordNew;
    var instrument = req.body.instrument;
    console.log(email);
    //console.log(username);
    db.query("SELECT * from users where username = ? and password = ?",[username,currentPassword],function(error,results,fields){
        if(results.length > 0)
        {
            if(newPassword.length == 0)
            {
                db.query("UPDATE users SET name = ?, email=?, phone = ?, instrument = ? WHERE username = ?",[fullName,email,phone,instrument,username],function(error,results,fields)
                {
                    console.log("Details updated for ?"[username]);
                    res.redirect('html/settings.html');
                })
            }
            else
            {
                db.query("UPDATE users SET name = ?, email=?, phone = ?, password =?, instrument = ? WHERE username = ?",[fullName,email,phone,newPassword,instrument,username],function(error,results,fields)
                {
                    console.log("Details updated for ?"[username]);
                    res.redirect('html/settings.html');
                })
            }
        }
        else
        { 
            console.log('incorrent password');
           
        }})

})
app.get('/creation', encoder, function(req,res)
{
    db.query("Select * from users where username = (?)",[currentUsername], function(error, results)
    {
        resultsarray = []
        for(let i = 0; i < results.length; i++)
        {
            resultsarray.push(results[i]);
        }
        console.log(resultsarray[0].email);
        if (resultsarray[0].email == null)
        {
            res.render('nullcreation',{message:"Please go to settings and input your email before you are able to create a lesson"});
        }
        else
        {
            res.redirect('/html/lesson.html')
        }
    })
})
app.get('/searchpage', encoder, function(req,res)
{
    console.log('test');
    db.query("Select * from bookings",function(error,results)
    {
        resultsarray = []
           for(let i = 0; i < results.length; i++)
           {
                resultsarray.push(results[i]);
                console.log(resultsarray[i].instrument)
           }
           res.render('search',{resultsarray: resultsarray});
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
           res.redirect('html/search.html');
       }
       else
       {
           resultsarray = []
           for(let i = 0; i < results.length; i++)
           {
                resultsarray.push(results[i]);
                console.log(resultsarray[i].instrument)
           }
           //console.log(JSON.stringify(resultsarray));
           //resultsarray = JSON.stringify(resultsarray);
           //console.log(resultsarray.length);
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
    var meeting = req.body.type;
    var price = req.body.price;
    console.log(email);
    db.query("INSERT INTO bookings (email,date,instrument,message,meeting,price) VALUES (?,?,?,?,?,?)",[email,date,instrument,message,meeting,price],function(error,results){
        if (error) throw error;
    res.redirect("html/lesson.html");
    console.log(price);
        
  })
})

app.get('/upload', (req,res) =>{
    res.sendFile(__dirname +'/html/upload.html')
    
})
app.get("/0", (req,res) =>
{
    //console.log()
    var booking = (resultsarray);
    console.log(booking[0].email);
    db.query("UPDATE bookings SET booked = 1 where email = ?",[booking[0].email]);
    res.render('nullcreation', {message:"You have booked a lesson, please contact the teacher via this email: "+[booking[0].email]})
})

app.get("/1", (req,res) =>
{
    console.log(resultsarray[1]);
    var booking = (resultsarray);
    console.log(booking[0].email);
    db.query("UPDATE bookings SET booked = 1 where email = ?",[booking[1].email]);
})
app.get("2", (req,res) =>
{
    console.log(resultsarray[2]);
})


app.get('/', (req,res) =>{
    res.sendFile(__dirname +'/html/index.html')
    console.log('test')
    
})
app.get('/settings', async (req,res)=> {
    //console.log('this works');
    //console.log(username);
    var userEmail;
    var bookingEmail;
    db.query ("SELECT email FROM users WHERE username = (?)",[username],(error,results) => {
            userEmail = results[0].email;
            if(results[0].email == null)
            {
                console.log('does this work ?')
                console.log(results[0])
                res.redirect('html/settings.html')
                //throw error;
                
            }
            else
            {
                db.query("SELECT * FROM bookings WHERE email = ?",[userEmail],(error,results)=>{
                   
                    if(results.length == 0)
                    {

                        res.redirect("html/settings.html")
                    }
                    else 
                    {
                        var bookedArray = []
                        for (let i = 0; i < results.length;i++)
                        {
                            if(results[i].booked == 1)
                            {
                                bookedArray.push(results[i].instrument);
                            }
                        }

                        if (bookedArray.length == 0)
                        {
                            res.redirect('html/settings.html')
                            console.log('none here')
                        }
                        else{
                            res.render('settings', {results: bookedArray});
                            console.log(bookedArray);
                        }
                        
                    }
                })
            }
    })
})
app.listen(4500);