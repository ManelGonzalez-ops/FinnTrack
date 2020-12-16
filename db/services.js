const { query } = require("./db")
const db = require("./db")

module.exports = {
    createUserTable: (cb) => {
        db.query("create table if not exists users (userId int auto_increment, firstName char(30) not null, lastName char(30) not null, email char(50) not null unique, primary key(userId))", err => {
            if (err) cb(err)

            cb(false)

        })
    },

    addNewUser: (user) =>
        new Promise((resolve, reject) => {
            const { firstName, lastName, email } = user.profile
            db.query("insert into users (firstName , lastName, email) values (?,?,?)",
                [firstName, lastName, email], err => {
                    if (err) {
                        reject(err)
                    }
                    resolve(user)
                })
        }),

    createOperationTable: (cb) => {
        db.query("create table if not exists operations (orderId int auto_increment, operationtype char(30), ticker char(30), amount int, price int, userId int, primary key (orderId), foreign key (userId) references users (userId))", err => {
            if (err) {
                cb(err)
            }
            cb(false)
        })
    },
    findUser: (email) => {
       return new Promise((resolve, reject) => {
            db.query("select userId from users where email = ?",
                [email], (err, data) => {
                    if (err) {
                        console.log(err, "errur 1")
                        reject(err)
                    }
                    if (!data.length){
                        reject("db returned empty object")
                        console.log(err, "errur 3")
                    }
                    resolve(data[0].userId)
                    console.log("success baby")
                })
        })
    },
    addOperation: (operation, userId) => {
        return new Promise((resolve, reject) => {
            const { operationType, ticker, amount, price } = operation
            db.query("insert into operations (operationtype , ticker, amount,  price, userId) values (?,?,?,?,?)",
                [operationType, ticker, amount, price, userId], err => {
                    if (err) {
                        reject(err)
                        console.log(err, "errur 2")
                    }
                    resolve()
                    console.log("success baby")
                })
        })
    }
}