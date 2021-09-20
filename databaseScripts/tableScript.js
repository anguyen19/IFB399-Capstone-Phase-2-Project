var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255),PRIMARY KEY(username))";
  var insertAdmin = "INSERT INTO users (username, password) VALUES ('admin','password')";
  var dummydata =   ['john','matt','andy','ken','zac','lorraine'];
  var bookingTable = "CREATE TABLE IF NOT EXISTS bookings (email VARCHAR(255), date DATE,instrument VARCHAR(255), message VARCHAR(255), PRIMARY KEY(email))";
  //Creating users table
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
  //insert user
  con.query(insertAdmin, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  //Insert dummy data
  for(let i = 0; i < dummydata.length; i++)
  {
    con.query("INSERT INTO users (username, password) VALUES ('"+dummydata[i]+"','password')",function (err, result)
    {
      if (err) throw err;
      console.log("user: "+dummydata[i]+" has been added");
    });
  }
  //Create booking table
  con.query(bookingTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});