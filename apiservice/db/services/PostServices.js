const { reject } = require("core-js/fn/promise");
const { resolve } = require("path");
const db = require("../db");

module.exports = {
  // si es isPrincipal es true, no tendrá parent id, por lo que lo fijaremos a 0
  createPostRegister: () => new Promise((resolve, reject) => {
    db.query("create table if not exists postRegister (postId int auto_increment, isPrincipal boolean, creation_date date, parentId int, ancestorId int, likes int default 0, usersVoted json, primary key (postId))", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),
  createPostStructure: () => new Promise((resolve, reject) => {
    db.query("create table if not exists postStructure (ancestorId int, structure json, primary key (ancestorId), foreign key (ancestorId) references postRegister (postId)) ", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }),
  // when isPrincipal is true, parentId is always 0
  addtoPostRegister: ({
    parentId, date, isPrincipal, ancestorId,
  }) => {
    const usersVoted = [];
    return new Promise((resolve, reject) => {
      db.query("insert into postRegister (isPrincipal, creation_date, parentId, ancestorId, usersVoted) values (?,?,?,?,?)", [isPrincipal, date, parentId, ancestorId, JSON.stringify(usersVoted)], (err, row) => {
        if (err) {
          reject(err);
        }
        console.log(row, "retuuuurneed");
        resolve(row);
      });
    });
  },
  addNewPost: (ancestorId, postItem) => new Promise((resolve, reject) => {
    db.query("insert into postStructure (ancestorId,structure) values(?, ?)", [ancestorId, JSON.stringify([postItem])], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row && row.affectedRows) {
        resolve();
      }
      reject();
    });
  }),
  getStructureByAncestor: (ancestorId) => new Promise((resolve, reject) => {
    db.query("select * from postStructure where ancestorId = ?", ancestorId, (err, row) => {
      if (err) {
        reject(err);
      }
      console.log(row, "struuuuu");
      if (!row) {
        reject("returned no rows");
      }
      resolve(row);
    });
  }),
  updatePostStructure: (updatedStructure, ancestorId) => {
    console.log(updatedStructure, "que cojones pasa");
    const tusmuertos = JSON.stringify({ mierda: "mucha maricon" });
    // const puta = JSON.stringify(updatedStructure)
    return new Promise((resolve, reject) => {
      db.query("update postStructure set structure = ? where ancestorId = ?", [JSON.stringify(updatedStructure), ancestorId], (err, row) => {
        if (err) {
          reject(err);
        }
        if (!row) {
          reject("returned no rows");
        }
        console.log(row, "qe coxa");
        resolve(row);
      });
    });
  },
  getPostsDB: () => new Promise((resolve, reject) => {
    db.query("select structure from postStructure", (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  }),
  getPostRegisterByPostId: (postId) => new Promise((resolve, reject) => {
    db.query("select * from postRegister where postId=?", [postId], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row) {
        console.log(row, "retrieved post by id");
        resolve(row[0]);
      }
      reject("no daata returned");
    });
  }),
  updatePostLikes: (likes, usersVoted, postId) => new Promise((resolve, reject) => {
    db.query("update postRegister set likes = ?, usersVoted=? where postId=?", [likes, JSON.stringify(usersVoted), postId], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row) {
        console.log(row, "retrieved post by id");
        resolve(row);
      }
      reject("no daata returned");
    });
  }),
};
