const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  timezone: "gmt",
});

db.connect((err) => {
  if (err) console.log(err);
  console.log("mysql connected");
});

db.query("create database if not exists financeapp", (err) => {
  if (err) throw err;
  console.log("success");
});

db.query("use financeapp", (err) => {
  if (err) throw err;
  console.log("using finance app");
});

module.exports = db;
