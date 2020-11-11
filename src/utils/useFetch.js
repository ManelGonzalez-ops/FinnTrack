import React, { useEffect, useState } from "react";
import { useDataLayer } from "../Context";

export const useFetch = (url, ticker, field) => {

  const { state, dispatch } = useDataLayer()

  const [{ datos, loading, error }, setRequest] = useState({
    datos: "",
    loading: false,
    error: "",
  });

  useEffect(() => {
    const fetchar = async (query) => {
      console.log(isInLocalStorage(field), "ceeeeeeee")
      if (!isInLocalStorage(field)) {
        try {
          setRequest((prev) => ({ ...prev, loading: true }));
          let dir;
          query === null ?
            dir = url
            :
            dir = `${url}/${query}`
          const rawData = await fetch(dir);
          const { data } = await rawData.json();
          dispatch({ type: "STORE_DATA", payload: { ticker: ticker, field: field, value: data } })

        } catch (err) {
          setRequest((prev) => ({
            ...prev,
            loading: false,
            error: err.message,
          }));
        }
      }
      // else{
      //   const dataAll = JSON.parse(localStorage.getItem(field))
      //   setRequest((prev) => ({ ...prev, datos: dataAll[ticker], loading: false }));
        
      // }
    }
    fetchar(ticker);

  }, [ticker]);

  useEffect(() => {
    console.log("ahora", state)
    if (state[field][ticker]) {
      setRequest(prev => ({
        ...prev,
        loading: false,
        datos: state[field][ticker]
      }))
      try{
        localStorage.setItem(field, JSON.stringify(state[field]))
      }
      catch(e){
        console.log(e, "eeeee")
      }
      
    }
  }, [state])

  const isInLocalStorage = (field) => {
    //check if we have this data already in localStorage
    if (localStorage.getItem(field)) {
      const dataAll = JSON.parse(localStorage.getItem(field))
      if (dataAll[ticker]) {
        setRequest(prev => ({
          ...prev,
          loading: false,
          datos: dataAll[ticker]
        }))
        console.log("nowwww")
        //we won't make additional request
        return true
      }
      return false
    }
    else{

      return false
    }
  }

  return { datos, loading, error };
};
