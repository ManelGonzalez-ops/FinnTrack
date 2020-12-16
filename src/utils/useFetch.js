import React, { useEffect, useState } from "react";
import { useDataLayer } from "../Context";

//ticker can refer as a category
export const useFetch = (url, ticker, field, options) => {

  const { state, dispatch } = useDataLayer()

  const [{ datos, loading, error }, setRequest] = useState({
    datos: "",
    loading: false,
    error: ""
  });

  useEffect(() => {
    console.log(datos, "daaaatooos")
    const fetchar = async (query) => {
      console.log(isInState(field), "ceeeeeeee")
      if (!isInState(field)) {
        try {
          setRequest((prev) => ({ ...prev, loading: true }));
          let dir;
          if(options.explicitUrl){
            dir = url
          }else{
            query === null ?
            dir = url
            :
            dir = `${url}/${query}`
          }
          const rawData = await fetch(dir);
          const data = await rawData.json();
          dispatch({ type: "STORE_DATA", payload: { ticker: ticker, field: field, value: data } })

        } catch (err) {
          setRequest((prev) => ({
            ...prev,
            loading: false,
            error: err.message,
          }));
        }
      }
      else{
        setRequest(prev => ({
          ...prev,
          loading: false,
          datos: state[field][ticker]
        }))
      }
    }
    fetchar(ticker);

  }, [ticker]);

  useEffect(() => {
    console.log("ahora", state)
    if ( state[field] && state[field][ticker]) {
      setRequest(prev => ({
        ...prev,
        loading: false,
        datos: state[field][ticker]
      }))
      if (field !== "prices") {
        try {
          localStorage.setItem(field, JSON.stringify(state[field]))
        }
        catch (e) {
          console.log(e, "eeeee")
        }
      }
    }
  }, [state])


  const isInState = (field) => {
    //check if we have this data already in localStorage
    console.log(field, "campo")
    if (state[field]) {
      console.log(field, ticker, "esta en mayuscula o que")
      if (state[field][ticker]) {
        //we won't make additional request
        return true
      }
      return false
    }
    else {

      return false
    }
  }

  return { datos, loading, error };
};
