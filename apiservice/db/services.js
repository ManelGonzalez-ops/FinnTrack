const db = require("./db");

module.exports = {
  // if method is local, socialId will be null
  createUserTable: (cb) => {
    db.query("create table if not exists users (userId int auto_increment, password char(100), email char(50) not null unique, username char(50) unique, method char(15), socialId varchar(50), portfolioInitial date, primary key(userId))", (err) => {
      if (err) cb(err);

      cb(false);
    });
  },

  // este creo que ya no lo usamos
  addNewUser: (user, username) => new Promise((resolve, reject) => {
    const { firstName, lastName, email } = user.profile;
    db.query("insert into users (firstName , lastName, email, username) values (?,?,?)",
      [firstName, lastName, email, username], (err) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
  }),

  createOperationTable: (cb) => {
    db.query("create table if not exists operations (orderId int auto_increment, opdate date, operationtype char(30), ticker char(30), amount int, price int, isFirstOperation boolean, assetType char(20), fundId int, userId int, primary key (orderId), foreign key (userId) references users (userId))", (err) => {
      if (err) {
        cb(err);
      }
      cb(false);
    });
  },
  findUser: (email) => new Promise((resolve, reject) => {
    db.query("select userId from users where email = ?",
      [email], (err, data) => {
        if (err) {
          console.log(err, "errur 1");
          return reject(err);
        }
        console.log(data, "puta data");
        if (!data.length) {
          return reject(new Error("db returned empty object"));
          console.log(err, "errur 3");
        }
        console.log(data[0], "que coll", data[0].userId);
        resolve(data[0].userId);
        console.log("success baby");
      });
  }),
  findUserById: (id) => new Promise((resolve, reject) => {
    db.query("select * from users where userId = ?",
      [id], (err, data) => {
        if (err) {
          console.log(err, "errur 1");
          reject(err);
        }
        resolve(data[0]);
        console.log("success baby");
      });
  }),
  addOperation: (operation, userId) => new Promise((resolve, reject) => {
    const {
      operationType, date, ticker, amount, isFirstOperation, price, assetType,
    } = operation;
    console.log(operation, "poeration");
    db.query(`insert into operations (operationtype, opdate, ticker, amount, price, isFirstOperation, assetType, userId, ${assetType === "peopleFund" && "fundId"}) values (?,?,?,?,?,?,?,?${assetType === "peopleFund" && ",?"})`,
      [operationType, date, ticker, amount, price, isFirstOperation, assetType, userId, assetType === "peopleFund" && operation.fundId], (err) => {
        if (err) {
          reject(err);
          console.log(err, "errur 2");
        }
        resolve();
        console.log("success baby");
      });
  }),
  // se supone que el usurio est?? ya autentificado
  getOperations: (email) => new Promise((resolve, reject) => {
    db.query("SELECT * from operations where userId = (select userId from users where email = ?)", [email], (err, data) => {
      if (err) {
        reject(err);
        console.log(err, "errur 3");
      }
      resolve(data);
    });
  }),
  getOperationsByUserId: (id) => new Promise((resolve, reject) => {
    db.query("SELECT * from operations where userId = ?", [id], (err, data) => {
      if (err) {
        reject(err);
        console.log(err, "errur 3");
      }
      if (data) {
        return resolve(data);
      }
      reject(new Error("no operation found for userId ", id));
    });
  }),
  createCompanyInfo: (cb) => {
    db.query("create table if not exists companyinfo (ticker char(30), company_name varchar(100), logourl varchar(100), weburl varchar(100), primary key(ticker))", (err) => {
      if (err) cb(err);
      cb(false);
    });
  },
  addCompanyInfo: (valArr) => {
    const bulkValues = valArr.map((item) => [item.ticker, item.response.logo, item.response.weburl, item.response.name]);
    return new Promise((resolve, reject) => {
      db.query("insert into companyinfo (ticker, logourl, weburl, company_name) VALUES ?", [bulkValues], (err) => {
        if (err) reject(err);
        resolve(bulkValues);
      });
    });
  },
  getCompanyInfo: (ticker) => new Promise((resolve, reject) => {
    db.query("select * from companyinfo where ticker = ?", [ticker], (err, data) => {
      if (err) reject();
      // if it's error, it will result into an empty array in the promise.all
      resolve(data);
    });
  }),
  createCompaniesJsonTable: () => {
    db.query("create table if not exists companiesjsondata (field char(30), fecha date, alldata JSON, primary key(field)) ");
  },
  getGeneralDataJson: (field, fecha) => new Promise((resolve, reject) => {
    db.query("select * from companiesjsondata where field = ? and fecha = ?", [field, fecha], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  storeGeneralData: (field, validDate, jsonArr) => new Promise((resolve, reject) => {
    db.query("insert into companiesjsondata (field, fecha, alldata) values (?,?,?) on duplicate key update fecha = values(fecha), alldata = values(alldata)", [field, validDate, JSON.stringify(jsonArr)], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),
  deletePreviousDateRecord: (field) => new Promise((resolve, reject) => {
    db.query("delete from companiesjsondata where field = ?", [field], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),

  getAllOperations: () => new Promise((resolve, reject) => {
    db.query("select * from operations", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  getAllUsers: () => new Promise((resolve, reject) => {
    db.query("select * from userDetails right join users on users.userId = userDetails.userId", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  createPortfolioTable: () => new Promise((resolve, reject) => {
    db.query("create table if not exists portfolios (userId int, portfolio JSON, last_updated date, primary key (userId), foreign key (userId) references users (userId))", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),
  addPortfolioDB: (userId, portfolio, fecha) => new Promise((resolve, reject) => {
    db.query("insert into portfolios (userId, portfolio, last_updated) values (?,?,?)", [userId, JSON.stringify(portfolio), fecha], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),
  // we have to update it everytime a user makes a new operation
  updatePortfolioDB: (userId, portfolio, today) =>
  // console.log(userId, portfolio, today, "que hostia")
    new Promise((resolve, reject) => {
      db.query("update financeapp.portfolios set portfolio = ?, last_updated = ? where userId = ?", [JSON.stringify(portfolio), today, userId], (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }),

  getOutdatedPortfoliosDB: (today) => new Promise((resolve, reject) => {
    db.query("select * from portfolios where last_updated = ?", [today], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  getAllPortfoliosDB: () => new Promise((resolve, reject) => {
    db.query("select * from portfolios", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  portfolioExists: (userId) => new Promise((resolve, reject) => {
    db.query("select * from portfolios where userId = ?", [userId], (err, row) => {
      if (err) {
        reject();
      }
      if (row && row.length) {
        resolve(true);
      }
      resolve(false);
    });
  }),
  getPortfoliosByIds: (ids) => {
    console.log(ids, "el puto id");
    return new Promise((resolve, reject) => {
      db.query("select * from portfolios where userId = ?", [ids], (err, rows) => {
        if (err) {
          reject(err);
        }
        if (!rows) {
          reject("no rows found");
        }
        resolve(rows);
      });
    });
  },

  proba: () => new Promise((resolve, reject) => {
    db.query("select * from portfolios", (err, rows) => {
      if (err) {
        reject(err);
      }
      if (!rows || !rows.length) {
        reject("no rows found");
      }
      console.log(rows, "la data proba");
    });
  }),
  getUserByUsername: (username) => {
    console.log(username);
    return new Promise((resolve, reject) => {
      db.query("select userId, username from users where username = ?", [username], (err, data) => {
        if (err) {
          reject(err);
        }
        resolve({ userId: data[0].userId, username });
      });
    });
  },
  getUsername: (email) => new Promise((resolve, reject) => {
    db.query("select username from users where email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      }
      if (!row || !row.length) {
        reject("no usernme found for given email");
      }
      resolve(row[0].username);
    });
  }),

  getUserFromUsername: (tickerFund) => {
    console.log("marika", tickerFund);
    return new Promise((resolve, reject) => {
      db.query("select * from users where username = ?", [tickerFund], (err, row) => {
        if (err) {
          console.log(err, "puto errouiwy");
          reject(new Error(err));
        }
        if (!row || !row[0]) {
          console.log(row);
          reject(new Error("no data enough"));
        }
        resolve(row[0]);
      });
    });
  },

};
