import { promises } from 'dns'
import React, { useState, useEffect } from 'react'
import Ticker, { FinancialTicker, NewsTicker } from 'nice-react-ticker';

export const TickerBar = () => {
    const [data, setData] = useState("")
    // esto tiene que ser una request diaria unica en el servidor, y sobreescribirlos en la base de datos (elminiar los de ayer)
    const promiseArr = ["gainers", "losers"].map(field => fetch(`https://financialmodelingprep.com/api/v3/${field}?apikey=651d720ba0c42b094186aa9906e307b4`)
        .then(res => res.json())
        .catch(err => console.log(err))
    )
    useEffect(() => {
        const fetchar = async () => {
            try {
                const dataArr = await Promise.all(promiseArr)
                console.log(dataArr, "ubera")
                const koko = dataArr.reduce((total, field) => [...total, ...field])
                console.log(koko, "ubera")
                setData(koko)
            }
            catch (err) {
                console.log(err, "guarru")
            }
        }
        fetchar()
    }, [])
    return (
        <>
            {
                data &&
                <Ticker offset="run-in">
                    {data.map(item => (
                        <FinancialTicker key={item.ticker} change={true} symbol="S&P 500" lastPrice="3372.2" percentage="0.38%" currentPrice="12.9" />
                    ))}
                </Ticker>}
        </>
        // <Ticker>
        //    { ()=>[...Array(50).keys()].map(item=><>{item}</>)}
        // </Ticker>
    )
}