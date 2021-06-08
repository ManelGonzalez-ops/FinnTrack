const db = require("../db");

module.exports = {
    createUserDetails: () =>
        // ojo si cambiamos el idioma, quiz-as "masculino" en moro es larguisimoo
        new Promise((resolve, reject) => {
            db.query("create table if not exists userdetails (userId int auto_increment, country char(50), image char(150), static_image boolean not null default 1, firstName char(30), lastName char(30), gender char(20), nacimiento date, primary key (userId), foreign key (userId) references users (userId))", (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }),
    uploadImage: (userId, imagePath) =>
        // if user was authenticated with social login and changes img we have to set static_image to change the picture flow
        new Promise((resolve, reject) => {
            db.query("insert into userdetails (userId, image, static_image) values(?,?,?) on duplicate key update image = values(image), static_image = values(static_image)", [userId, imagePath, true], (err, row) => {
                if (err) {
                    reject(err);
                }
                console.log(row, "img upload?");
                resolve();
            });
        }),
    setPortfolio: (email, date) => new Promise((resolve, reject) => {
        db.query("update users set portfolioInitial = ? where email=?", [date, email], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    }),
    getPortfolioInitialDay: (email) => new Promise((resolve, reject) => {
        db.query("select portfolioInitial from users where email = ?", [email], (err, row) => {
            if (err) {
                reject(err);
            }
            if (!row || !row.length) {
                reject(new Error("portfolio initial date not found"));
            }
            resolve(row[0].portfolioInitial);
        });
    }),

    addContactInfo: (userId, fieldsObj) => {
        console.log(fieldsObj);
        const fieldKeys = Object.keys(fieldsObj);
        const fields = ["userId", ...fieldKeys];
        // add extra ? for userId
        const values = [...Array(fieldKeys.length + 1).fill("?")];
        const update = fieldKeys.map((key) => `${key}=values(${key})`);
        const inputs = fieldKeys.map((key) => fieldsObj[key]);
        const query = `insert into userdetails (${fields}) values(${values}) on duplicate key update ${update}`;
        console.log(query, "aver query");
        return new Promise((resolve, reject) => {
            db.query(query, [userId, ...inputs], (err, row) => {
                if (err) {
                    return reject(err);
                }
                console.log(row, "tha row", typeof row);
                if (typeof row === "object") {
                    // mean we received okPacket, which is succesg¡full
                    console.log("resolviendo");
                    return resolve();
                }
                // this is wrong because row.length will be always false as that won't be an array
                if (!row || !row.length) {
                    return reject(new Error("error inserting or updating"));
                }
                resolve();
            });
        });
    },
    // initial state of User details view
    getUserDetailsDB: (userId) => new Promise((resolve, reject) => {
        db.query("select * from userdetails where userId = ?", [userId], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row || !row.length) {
                return reject(new Error("no data returned"));
            }
            resolve(row);
        });
    }),
    getUserDetailsDBEmail: (email) => new Promise((resolve, reject) => {
        db.query("select * from userdetails where userId = (select userId from users where email = ?) ", [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            // if (!row || !row.length) {
            //     return reject(new Error("no data returned"))
            // }
            resolve(row);
        });
    }),
    getUserImageDB: (userId) => new Promise((resolve, reject) => {
        db.query("select image from userdetails where userId = ?", [userId], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row || !row.length) {
                return reject(new Error("no data returned"));
            }
            resolve(row[0].image);
        });
    }),
    getUserByField: (fieldKey, value) => new Promise((resolve, reject) => {
            db.query(`select * from users where ${fieldKey} = ${value}`, (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row || !row[0]) {
                    reject(new Error("no user returned"));
                }
                resolve(row[0]);
            });
        }),
};
