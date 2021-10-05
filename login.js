//import modules
const mysql = require("mysql");
const express = require("express");
const encoder = express.urlencoded();
const upload = require('express-fileupload');
const app = express();
const pug = require('pug');
const { application } = require("express");
const { Http2ServerRequest } = require("http2");
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
                    res.redirect('settings.html');
                })
            }
            else
            {
                db.query("UPDATE users SET name = ?, email=?, phone = ?, password =?, instrument = ? WHERE username = ?",[fullName,email,phone,newPassword,instrument,username],function(error,results,fields)
                {
                    console.log("Details updated for ?"[username]);
                    res.redirect('settings.html');
                })
            }
        }
        else
        { 
            console.log('incorrent password');
           
        }})

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
    console.log(email);
    db.query("INSERT INTO bookings (email,date,instrument,message) VALUES (?,?,?,?)",[email,date,instrument,message],function(error,results){
        if (error) throw error;
    res.redirect("/booking.html");
        
  })
})

app.get('/upload', (req,res) =>{
    res.sendFile(__dirname +'/upload.html')
    
})
app.get("/0", (req,res) =>
{
    //console.log()
    var booking = (resultsarray);
    console.log(booking[0].email);
    db.query("UPDATE bookings SET booked = 1 where email = ?",[booking[0].email]);
})

app.get("/1", (req,res) =>
{
    console.log(resultsarray[1]);
})
app.get("2", (req,res) =>
{
    console.log(resultsarray[2]);
})


app.get('/', (req,res) =>{
    res.sendFile(__dirname +'/index.html')
    
})
app.get('/settings', async (req,res)=> {
    //console.log('this works');
    //console.log(username);
    var userEmail;
    var bookingEmail;
    db.query ("SELECT email FROM users WHERE username = (?)",[username],(error,results) => {
            userEmail = results[0].email;
            console.log(userEmail)
            if(results[0].email == null)
            {
                console.log(results[0])
                res.render('settings', {results: "no lesson requests"});
                //throw error;
                
            }
            else
            {
                //console.log(results)
                db.query("SELECT * FROM bookings WHERE email = ?",[userEmail],(error,results)=>{
                   
                    if(results.length == 0){

                    }
                    else 
                    {
                        bookingEmail = results[0].email;
                        //console.log(results);
                        if(userEmail == bookingEmail && results[0].booked == 1)
                        {
                            console.log(results[0].instrument)
                            var response = 'New lesson Request for '+results[0].instrument
                            res.render('settings', {results:response});
                        }
                    }
                })
            }
    })
   
    //var bookingEmail = db.query("SELECT * from bookings where email =")
    //res.render('settings');
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