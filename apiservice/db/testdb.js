const db = require("./db");

const getUsers =()=>{
    db.query("select * from users", (err, data)=>{
        if(err){
            console.log(err)
        }
        console.log(data)
    })
}

getUsers()