const fetch = require("node-fetch")
const fs = require("fs")
const path = require("path")

// fetch("https://jsonplaceholder.typicode.com/todos/")
// .then(res=>res.json())
// .then(res=>{
//     fs.writeFile("koko.json", JSON.stringify(res), (err)=>{
//         if(err) throw(err)
//         fs.readFile("koko.json", (err, data)=>{
//             if(err) throw(err)
//             console.log(data, "datooona")
//             console.log(data.toString(), "datooona")
//         })
//     })
// })
console.log(path.join(__dirname, "/data/own_countries_by_population.json"))