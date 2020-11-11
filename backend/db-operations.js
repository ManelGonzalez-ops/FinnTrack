const {createKeyTable, addCompany, addCompanyKey, createProcedure} = require("./services")


const initializePrueba =()=>{
    return new Promise((resolve, reject)=>{
        createKeyTable(err=>{
            if (err) reject(err)
            addCompanyKey({id: "9999", name: "Manilox Condoms"}, (err, res)=>{
                //no podemon utilizar cadenas solo numericas, ni tampoco simbolos en el nombre de la tabla
                let iden = `cif${res}`
                if (err) reject(err)
                addCompany(iden, err=>{
                    if (err) reject(err)
                    resolve()
                })

            })
        })
    }) 
}



initializePrueba()
.then(item=>{console.log(item)})
.catch(err=>{console.log(err)})
