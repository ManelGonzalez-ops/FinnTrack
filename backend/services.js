const db = require("./db")

module.exports = {

    createKeyTable: (cb) => {
        db.query("create table if not exists companies (id char(30), name varchar(100), primary key (id))", err => {
            if (err) cb(err)
            // this.createProcedure()
            cb(false)
        })
    },
    addCompanyKey: (data, cb) => {
        db.query("insert into companies (id, name) values (?,?)",
            [data.id, data.name], err => {
                if (err) cb(err);
                cb(false, data.id)

            })
    },
 
    createProcedure: (cb) => {
        db.query("drop procedure if exists addCompany; create procedure addcompany(OUT cif char(30)) create table `cif` (iden char(30), name varchar(100), total_assets int, equity int, cash int, revenues int, income int, financing int, investing int, operating int, primary key (iden), foreign key (iden) references companies(id))",
        err=>{
            if(err) cb(err)
            cb("procedure ready")
        }
        )
    },

    addCompany: (id, cb) => {
        db.query(`create table if not exists ${id} (iden char(30), name varchar(100), totalassets int, equity int, cash int, revenues int, income int, financing int, investing int, operating int, primary key (iden), foreign key (iden) references companies(id)) ENGINE=INNODB;`, err=>{
            if (err) cb(err)
            cb(false)
        })
    }

    // addCompanyKey: (data) => {
    //     db.query("insert into companies values(iden, name, total_assets, equity,cash, revenues, income, financing, investing, operating)")
    // }
}