const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   timezone: "gmt",
// });

const db = mysql.createConnection({
  host: "remotemysql.com",
  user: "dP6wX7ylr4",
  password: "KIwXTjyeaU",
  timezone: "gmt",
});

db.connect((err) => {
  if (err) console.log(err);
  console.log("mysql connected");
});

db.query("create database if not exists dP6wX7ylr4", (err) => {
  if (err) throw err;
  console.log("success");
});

db.query("use dP6wX7ylr4", (err) => {
  if (err) throw err;
  console.log("using finance app");
});

module.exports = db;
