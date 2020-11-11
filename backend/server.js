const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.get("/", (req, res)=>{
    console.log("kee pasa")
    res.status(200).send("hoola marika")
})

app.post("/generateobject", (req, res)=>{
    //console.log(req)
    console.log(req.body)
    console.log(JSON.stringify(req.body))
    console.log(JSON.parse(req.body))
    const bigJson = JSON.stringify(req.body)
    fs.writeFile("company_listing.json", bigJson, function (err){
        if(err) res.status(400).send(err)
        res.status(200).send("success")
    })
})

app.listen("7000", ()=>{
    console.log("serevr running")
})