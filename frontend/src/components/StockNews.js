import React from "react";
import { useFetch } from "../utils/useFetch";

export const StockNews = ({ match }) => {
  const { company } = match.params;
  const url = `${process.env.REACT_APP_API}/news`;
  const { data, loading, error } = useFetch(url, company, true);
  return (
    <div className="grida-p">
      <p>{loading && "cargando..."}</p>
      <p>{error && error}</p>
      <p>{data && JSON.stringify(data, null, 4)}</p>
    </div>
  );
};
