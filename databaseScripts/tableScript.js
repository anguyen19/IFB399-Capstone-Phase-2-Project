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
  var sql = "CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255))";
  var insert = "INSERT INTO users (username, password) VALUES ('admin','password')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
  con.query(insert, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});