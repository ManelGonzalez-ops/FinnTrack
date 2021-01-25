import { Chip, List, ListItem, ListItemText } from '@material-ui/core'
import React, { useEffect, useState, useRef } from 'react'
import { useDataLayer } from "../../Context"
import { camelCasePipe } from '../../utils/Pipes'

export const KeyMetrics = ({ ticker, setListHeight }) => {

    const { state , dispatch} = useDataLayer()
    const listo = useRef(null)
    const url = "https://www.alphavantage.co/query?function=OVERVIEW";
  
  const apiKey = "btm6dp748v6ud360stcg";
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("vas")
        //we need to check what happends if we pass undefined,
        if(!state.keymetrics[ticker] || !state.keymetrics[ticker] === undefined){
          console.log("que coño", state.keymetrics[ticker])
          setLoading(true);
          fetch(`${url}&symbol=${ticker}&apikey=${apiKey}`)
            .then((data) => data.json())
            .then((data) => {
              setLoading(false);
              setData(data);
            })
            .catch((err) => {
              setError(err.message);
            });
        }else{
          setData(state.keymetrics[ticker])
        }
      }, [state]);
      useEffect(() => {
        if(!state.keymetrics[ticker]){
          data && dispatch({type: "STORE_DATA", payload: {ticker: ticker, field: "keymetrics", value: data}})
        }
      }, [data])

    useEffect(() => {
        if (listo.current && Object.keys(data).length > 0) {
            //console.log(listo.current.offsetHeight, "hhhhhight")
            setListHeight(listo.current.offsetHeight)
        }
    }, [data])
   
    return (
        <ul className="list-modelo" ref={listo}>
            {Object.keys(data).length > 0 &&
                Object.keys(data).map(field => {
                    if (field.toLowerCase() === "description") {
                        return null
                    }
                    return (<li>
                        <Chip label={camelCasePipe(field)} size="small" />
                        <p style={{ marginLeft: "auto" }}>{data[field]}</p>
                    </li>)
                }
                )
            }
        </ul>
    )
}
