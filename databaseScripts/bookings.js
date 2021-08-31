
var login = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

app.use(express.static(__dirname))

//Connect to database 
login.connect(function(error){
    if (error) throw error
    else 
    {
        console.log("Connection Successful")
        
    }
});