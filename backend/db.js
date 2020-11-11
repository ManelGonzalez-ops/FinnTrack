const mysql = require("mysql")
const { createProcedure } = require("./services")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456"
})

db.connect(err => {
    if (err) console.log(err)
    console.log("mysql connected")
})

db.query("create database if not exists financeapp", err => {
    if (err) throw err
    console.log("success")
})



db.query("use financeapp", err => {
    if (err) throw err
    console.log("using finance app");
    // createProcedure(err=>{
    //     if(err) console.log(err.message)
    //     console.log("amama")
    // })
})



module.exports = db