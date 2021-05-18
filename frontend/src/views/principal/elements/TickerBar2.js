import React, { useEffect, useState } from "react";
import Ticker from "react-ticker";
import { useUILayer } from "../../../ContextUI";

const re = /^-/g
//most active companies
export const TickerBar2 = () => {
    const [data, setData] = useState("")
    const {tickerMove} = useUILayer()
    useEffect(() => {
        const fechar = () => {
            fetch("http://localhost:8001/api/v1/recurringTasks/direct_json?field=topactives")
                .then(res => res.json())
                .then(res => { setData(JSON.parse(res.alldata)) })
                // //if there's error,won't show
                .catch(err => { console.log(err) })
        }
        fechar()
    }, [])

    console.log("reeerendeeel")

    return (
        <div className="ticker">
            {
                data &&
                <Ticker
                move={tickerMove}
                >
                    {({ index }) => (
                        <>{
                            data.map(item => (
                                <span key={item.ticker} style={{ marginRight: "15px", whiteSpace: "nowrap" }}>{item.ticker} {item.price}
                                    <span
                                        style={re.test(item.changes) ? { color: "red" } : { color: "green" }}
                                    >{item.changes} {item.changesPercentage}</span>
                                </span>
                            ))
                        }
                        </>
                    )}
                </Ticker>}
        </div >
    )

}