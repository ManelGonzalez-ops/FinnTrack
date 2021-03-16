const db = require("../db")

module.exports = {

    getOperationsById: (userId)=>{
        return new Promise((resolve, reject)=>{
            db.query("select * from operations where userId=?", [userId], (err, row)=>{
                if(err){
                    reject(err)
                }
                if(row){
                    return resolve()
                }
                reject(new Error("no operations found"))
            })
        })
    }
}