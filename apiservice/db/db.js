const mysql = require("mysql");

const db_config = {
  host: "localhost",
  user: "root",
  password: "123456",
  timezone: "gmt",
};

// const db = mysql.createPool({
//   //max_user_connections: 20,
//   host: "db4free.net",
//   user: "financeapp",
//   password: "mameluco787",
//   timezone: "gmt",
//   database: "financeappdb"
// })


let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect((err) => { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });

  return connection
}

const db = handleDisconnect();

db.connect((err) => {
  if (err) console.log(err);
  console.log("mysql connected");
});

db.query("create database if not exists financeappdb", (err) => {
  if (err) throw err;
  console.log("success");
});

db.query("use financeappdb", (err) => {
  if (err) throw err;
  console.log("using finance app");
});

module.exports = db;
