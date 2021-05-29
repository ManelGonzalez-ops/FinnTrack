const db = require("../db")

module.exports = {
    getFundImage: (fundId) => {
        return new Promise((resolve, reject) => {
            db.query("select image from userDetails where userId = ?", [fundId], (err, row) => {
                if (err) {
                    reject(err)
                }
                if (!row || !row[0]) {
                    reject(new Error("no image returned from ", fundId))
                }
                resolve(row[0])
            })
        })
    },
    getAllUserInfoById: (userId) => new Promise((resolve, reject) => {
        db.query("SELECT * FROM users inner join userdetails on users.userId = userdetails.userId where users.userId = ?", [userId], (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        });
    }),
}