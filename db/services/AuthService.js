const db = require("../db")

module.exports = {
    getUser: (email) => {
        return new Promise((resolve, reject) => {
            db.query("select * from users where email = ?", [email], (err, row) => {
                if (err) {
                    reject(err)
                }
                console.log(row)
                if (!row || !row.length) {
                    reject("empty results for user")
                }
                resolve(row[0])
            })
        })
    }
}