import { HowToReg } from '@material-ui/icons'
import { arrayMax } from 'highcharts'
import React, { Component } from 'react'

export const Main =()=> {

    state = {
        equity: 200000,
        portfolio: [{}],
    }

    // purchase =()=>{
    //     stockprice * amount
    // }

    // //primero hacemos request consiguiendo todos los rangos de precios de golpe usanso Tiingo para cada empresa, y lo almacrnaremos en la store tal que así  {
    // //     ...Store,
    // //      companies:{//
    //             [12-06-19]: {
                        amzn:{
                            objecto con los datos del dia
                        }
    //                 appl:{
        objecto con los datos del dia
    }
    //             }
    //             [13-06-19]: {
                        amzn:{
                            objecto con los datos del dia
                        }
    //                 appl:{
        objecto con los datos del dia
    //             }
    //         
    // }
    // // }// 

    //el tema es que si un usuario compra acciones de una empresa y las vnde al dia suiuiente nosostros cojeremos todo el rango desde que se creo la cartera hasta el dia de hoy
    
    //el tema es que sabiendo en cada dia que empresas y cuantas acciones, solo necesitamos consultar en la store en esa fecha que empresas tenemos

    

    //luego para cada día

    example = [{ date: 4 / 5 / 2019, stocks: ["amnz", "apple", "kok"] }, { date: 5 / 6 / 2020 }]

    firstTime = portfolio[0].date
    totalMeses = firstTime - Hoy.date
    datador = () => {
        Array(totalMesses).forEach(item => {


            const getevrydayofthemonth = async (initialDay = 1) => {
                let daynum = initialDay
                const range = n => [...Array(n)]
                datesArr = []
                for (let _ of range(marks[month].day)) {
                    //do stuff here
                    checkarempresas()
                    
                    //

                    datesArr = [...datesArr, daynum / month / year]
                    daynum++
                }

            }
            if (month < elmesdehoy) {
                month++
            }
        })
    }
   checkarempresas =()=>{
       //tenemos que pillar al array example e comprobar para ese día que empresas tenemos en cartera y comprobar el change diario % y el precio
       // ese change % diario hay que multiplicarlo por la ponderacion relativa de cada stock, dando el change% global diario.
       //ese change% global diario se aplicará sobre el valor liquidativo de la cartera del día anterior para obtener el rendimiento para ese día 
       //ese valor liquidativo será el que usaremos para dibujar la grafica
       

   }
    example = [
        {
            date: 4 / 5 / 2019,
            stocks: [
                { ticker: "amnz", amount: 33 },
                { ticker: "tsl", amount: 70 }
            ]
        },
        {
            date: 5 / 6 / 2020,
            stocks: [
                { ticker: "amnz", amount: 33 },
                { ticker: "tsl", amount: 70 }
            ]
        }
    ]

    //aquí sacamos todos los tickers que tenemos que requestar al tiingo
    const getAllTickers =()=>{
        tickers = []
        example.forEach(day=>{
            day.stocks.forEach(stock=>{
                if (!tickers.includes(stock)){
                    tickers=[...tickers, stock]
                } 
            })
        })
        return tickers
    }

    //ahora enviamos request a nuestro servidor
    
    //hacemos una request post 
    const fechSerever = async()=>{
        const request = await fetch("http://localhost:8001/prices", {
            method: "POST",
            body: JSON.stringify(tickers)
        })
        const data = await request.json()
        return data 
    }

   const {state} = useDataLayer()

    for(item of example){
        state[company]
    }

    example.forEach()

        return (
            <div>

            </div>
        )
    }


//el mes es el que manda
const marks = [
    {
        1: {
            name: "January",
            label: "Jan",
            value: 1,
            days: 31,
        }
    },
    {
        name: "February",
        label: "Feb",
        value: 2,
        days: 28
    },
    {
        name: "March",
        label: "Mar",
        value: 3,
        days: 31
    },
    {
        name: "April",
        label: "Apr",
        value: 4,
        days: 30
    },
    {
        name: "May",
        label: "May",
        value: 5,
        days: 31
    },
    {
        name: "June",
        label: "Jun",
        value: 6,
        days: 30
    },
    {
        name: "July",
        label: "Jul",
        value: 7,
        days: 31
    },
    {
        name: "August",
        label: "Aug",
        value: 8,
        days: 31
    },
    {
        name: "September",
        label: "Sep",
        value: 9,
        days: 30
    },
    {
        name: "October",
        label: "Oct",
        value: 10,
        days: 31
    },
    {
        name: "November",
        label: "Nov",
        value: 11,
        days: 30
    },
    {
        name: "December",
        label: "Dec",
        value: 12,
        days: 31
    }
]