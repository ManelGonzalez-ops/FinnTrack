const { reject } = require("core-js/fn/promise")
const { resolve } = require("path")
const { query } = require("./db")
const db = require("./db")

module.exports = {
    createUserTable: (cb) => {
        db.query("create table if not exists users (userId int auto_increment,  firstName char(30) not null, lastName char(30) not null, email char(50) not null unique, primary key(userId))", err => {
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
        db.query("create table if not exists operations (orderId int auto_increment, opdate date, operationtype char(30), ticker char(30), amount int, price int, isFirstOperation boolean, userId int, primary key (orderId), foreign key (userId) references users (userId))", err => {
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
                    if (!data.length) {
                        reject("db returned empty object")
                        console.log(err, "errur 3")
                    }
                    console.log(data[0], "que coll", data[0].userId)
                    resolve(data[0].userId)
                    console.log("success baby")
                })
        })
    },
    addOperation: (operation, userId) => {
        return new Promise((resolve, reject) => {
            const { operationType, date, ticker, amount, isFirstOperation, price } = operation
            db.query("insert into operations (operationtype , opdate, ticker, amount, price, isFirstOperation, userId) values (?,?,?,?,?,?,?)",
                [operationType, date, ticker, amount, price, isFirstOperation, userId], err => {
                    if (err) {
                        reject(err)
                        console.log(err, "errur 2")
                    }
                    resolve()
                    console.log("success baby")
                })
        })
    },
    //se supone que el usurio está ya autentificado
    getOperations: (email) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from operations where userId = (select userId from users where email = ?)", [email], (err, data) => {
                if (err) {
                    reject(err)
                    console.log(err, "errur 3")
                }
                resolve(data)
            })
        })
    },
    createCompanyInfo: (cb) => {
        db.query("create table if not exists companyinfo (ticker char(30), company_name varchar(100), logourl varchar(100), weburl varchar(100), primary key(ticker))", err => {
            if (err) cb(err)
            cb(false)
        })
    },
    addCompanyInfo: (valArr) => {
        const bulkValues = valArr.map(item => [item.ticker, item.response.logo, item.response.weburl, item.response.name])
        return new Promise((resolve, reject) => {
            db.query("insert into companyinfo (ticker, logourl, weburl, company_name) VALUES ?", [bulkValues], (err) => {
                if (err) reject(err)
                resolve(bulkValues)
            })
        })
    },
    getCompanyInfo: (ticker) => {
        return new Promise((resolve, reject) => {
            db.query("select * from companyinfo where ticker = ?", [ticker], (err, data) => {
                if (err) reject()
                //if it's error, it will result into an empty array in the promise.all 
                resolve(data)
            })
        })
    },
    createCompaniesJsonTable: () => {
        db.query("create table if not exists companiesjsondata (field char(30), fecha date, alldata JSON, primary key(field)) ")
    },
    getMostActives: (field, fecha) => {
        return new Promise((resolve, reject) => {
            db.query("select * from companiesjsondata where field = ? and fecha = ?", [field, fecha], (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)

            })
        })
    },
    storeMostActives: (field, validDate, jsonArr) => {
        return new Promise((resolve, reject) => {
            db.query("insert into companiesjsondata (field, fecha, alldata) values (?,?,?)", [field, validDate, JSON.stringify(jsonArr)], (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    },
    deletePreviousDateRecord: (field) => {
        return new Promise((resolve, reject) => {
            db.query("delete from companiesjsondata where field = ?", [field], err => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })

    }
}