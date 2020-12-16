import React, { useEffect, useState } from "react";
import { useDataLayer } from "../Context";

//ticker can refer as a category
export const useFatch = (url, ticker, field, options) => {

  const { state, dispatch } = useDataLayer()

  const [{ datos, loading, error, wasInState }, setRequest] = useState({
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
          dispatch({ type: "SET_INDEXES", payload: { ticker: ticker, field: field, value: data } })

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
          datos: state.indexes[field][ticker]
        }))
      }
    }
    fetchar(ticker);

  }, [field]);

  useEffect(() => {
    console.log("ahora", state)
    if ( state.indexes[field] && state.indexes[field][ticker]) {
        console.log("turn off")
      setRequest(prev => ({
        ...prev,
        loading: false,
        datos: state.indexes[field][ticker]
      }))
      if (field !== ticker) {
        try {
          localStorage.setItem(field, JSON.stringify(state.indexes[field]))
        }
        catch (e) {
          console.log(e, "eeeee")
        }
      }
    }
  }, [state.indexes])


  const isInState = (field) => {
    //check if we have this data already in localStorage
    console.log(field, "campo")
    if (state.indexes[field]) {
      console.log(field, ticker, "esta en mayuscula o que")
      if (state.indexes[field][ticker]) {
        //we won't make additional request
        return true
      }
      return false
    }
    else {

      return false
    }
  }

  return { datos, loading, error, wasInState };
};
