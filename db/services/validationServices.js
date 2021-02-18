const db = require("../db")


module.exports = {

    checkEmailExists: (email) => {
        return new Promise((resolve, reject) => {
            db.query("select * from users where email = ?", [email], (err, rows) => {
                if (err) {
                    reject(err)
                }
                if (rows && rows.length) {
                    reject("already exists an account associated to that email")
                }
                resolve()
            })
        })
    },
    checkUserExists: (username) => {
        return new Promise((resolve, reject) => {
            db.query("select * from users where username = ?", [username], (err, rows) => {
                if (err) {
                    reject(err)
                }
                if (rows && rows.length) {
                    reject("already exists an account with that username")
                }
                resolve()
            })
        })
    },
}
