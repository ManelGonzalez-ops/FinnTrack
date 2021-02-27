const db = require("../db")
const { debugLine } = require("../../apiservice/ErrorHandler")
module.exports = {
    createUserDetails: () => {
        //ojo si cambiamos el idioma, quiz-as "masculino" en moro es larguisimoo
        return new Promise((resolve, reject) => {
            db.query("create table if not exists userDetails (userId int auto_increment, country char(50), image char(150), firstName char(30), lastName char(30), gender char(20), nacimiento date, primary key (userId), foreign key (userId) references users (userId))", (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    },
    uploadImage: (userId, image) => {
        return new Promise((resolve, reject) => {
            db.query("insert into userDetails (userId, image) values(?,?) on duplicate key update image = values(image)", [userId, image.path], (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    },
    setPortfolio: (email, date) => {
        return new Promise((resolve, reject) => {
            db.query("update users set portfolioInitial = ? where email=?", [date, email], (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    },
    getPortfolioInitialDay: (email) => {
        return new Promise((resolve, reject) => {
            db.query("select portfolioInitial from users where email = ?", [email], (err, row) => {
                if (err) {
                    reject(err)
                }
                if (!row || !row.length) {
                    reject(new Error("portfolio initial date not found"))
                }
                resolve(row[0].portfolioInitial)
            })
        })
    }
}