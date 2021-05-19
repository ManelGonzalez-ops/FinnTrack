import React from "react";
import { useFetch } from "../../utils/useFetch";

export const StockPrices = ({ match }) => {
  const { company } = match.params;
  const url = "http://localhost:8000/prices";
  const { data, loading, error } = useFetch(url, company, true);
  return (
    <div className="grida-p">
      <p>{loading && "cargando..."}</p>
      <p>{error && error}</p>
      <p>{data && JSON.stringify(data, null, 4)}</p>
    </div>
  );
};