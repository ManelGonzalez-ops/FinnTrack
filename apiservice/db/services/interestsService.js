const db = require("../db");

const fakeInterests = ["kaka", "culo", "pedo"];
module.exports = {
  createInterestTable: () => new Promise((resolve, reject) => db.query("create table if not exists interests (username char(50), interests_arr json, primary key (username), foreign key (username) references users (username))", (err, success) => {
    if (err) {
      reject(err);
    }
    resolve();
  })),

  getUserInterests: (email) => {
    // ojo a esta query
    console.log(email, "imail");
    return new Promise((resolve, reject) => {
      db.query("select * from users inner join interests ON interests.username = users.username where users.email = ?", [email], (err, rows) => {
        if (err) {
          reject(err);
        }
        if (!rows) { reject(new Error("wtf, it should give empty array but gave us undefined")); }
        // if (!rows.length) reject(debugLine("user wasn't found or has no interests" ))
        console.group(rows, "rwwors");
        if (!rows || !rows.length) {
          // this will eb an empty array
          resolve(rows);
        }
        resolve(rows);
      });
    });
  },

  addUserInterest: (username, interest) => {
    console.log(username, interest, "data");
    return new Promise((resolve, reject) => {
      db.query("insert into interests (username, interests_arr) values(?,?)", [username, JSON.stringify([interest])], (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  },
  updateUserInterest: (username, interest) => {
    // await this.
    console.log(interest, "intere");
    return new Promise((resolve, reject) => {
      db.query("update interests set interests_arr = ? where username = ?", [JSON.stringify(interest), username], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  },
  addInterestDB: () => db.query("insert into interests"),
};
