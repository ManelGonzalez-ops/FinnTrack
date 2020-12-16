import { List, ListItem, ListItemText } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useDataLayer } from '../../Context';

export const DetailsSquare = ({ticker}) => {
    const {state, dispatch } = useDataLayer()
  const url = "https://www.alphavantage.co/query?function=OVERVIEW";
  
  const apiKey = "btm6dp748v6ud360stcg";
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const kaka = useRef(0)
  kaka.current = kaka.current + 1
  useEffect(() => {
    console.log("vas")
    //we need to check what happends if we pass undefined,
    if(!state.keymetrics[ticker] || !state.keymetrics[ticker] === undefined){
      console.log(kaka.current, "kaka")
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
      //we are updating data in localstorage to inicialice initial state of the reducer every time we start the app
      setData(state.keymetrics[ticker])
      //data is already saved into localstorage
      //localStorage.setItem("keymetrics", JSON.stringify(state.keymetrics))
    }
  }, [state]);

  useEffect(() => {
    if(!state.keymetrics[ticker]){
      data && dispatch({type: "STORE_DATA", payload: {ticker: ticker, field: "keymetrics", value: data}})
    }
  }, [data])
    return (
        <>
        {loading && <p>cargando..</p>}
      {error && <p>{error}</p>}
      {data && (
        <List>
            <ListItem>
              <ListItemText>Sector</ListItemText>
              <ListItemText>{data.Sector}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Industry</ListItemText>
              <ListItemText>{data.Industry}</ListItemText>
            </ListItem>
          </List>)}
          </>
    )
}
