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
    },
    //firstName & lastName will be filled later
    storeNewUser: ({ email, username, hashedPwd }) => {
        return new Promise((resolve, reject) => {
            db.query("insert into users (email, username, hashedPwd) values (?,?,?)", [email, username, hashedPwd], (err, row) => {
                if (err) {
                    reject(err)
                }
                console.log(row, "row Storenewuser")
                resolve(row)
            })
        })
    },

    findUserBySocialId: (socialId, method) => {
        return new Promise((resolve, reject) => {
            db.query("select * from users where method = ? and socialId = ?", [method, socialId], (err, user) => {
                if (err) {
                    reject(err)
                }
                resolve(user[0])
            })
        })
    },

    storeNewUserSocial: (socialId, method, email, username) => {
        return new Promise((resolve, reject) => {
            db.query("insert into users (socialId, method, email, username) values(?,?,?,?)", [socialId, method, email, username], (err, okPacket) => {
                if (err) {
                    reject(err)
                }
                resolve(okPacket)
            })
        })
    }
}