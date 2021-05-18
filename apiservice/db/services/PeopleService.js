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
    }
}