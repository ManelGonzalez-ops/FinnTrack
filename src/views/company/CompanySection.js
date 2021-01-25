import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BottomSection } from "./BottomSection";
import { Paper } from "@material-ui/core";
import { KeyMetrics } from "./KeyMetrics";
import { CompanyChart } from "./CompanyChart";
import { useDataLayer } from "../../Context";
import { StockShop } from "../../portfolio/StockShop";


export const CompanySection = React.forwardRef((props, ref) => {

  const { state, dispatch } = useDataLayer()
  const { ticker } = state.currentCompany
  const [clasi, setClasi] = useState(false)
  const [tickar, setTicker] = useState(ticker)
  const params = useParams()
  const location = useLocation()
  const keyMetricsRef = useRef(null)
  const [listHeight, setListHeight] = useState(0)
  useEffect(() => {
    if (!tickar) {
      console.log(params, "los params", location, "location")
      const { company } = params
      setTicker(company.toUpperCase())
    }
  }, [])

  useEffect(() => {
    //polifill if the user browse directly without search
    if (tickar && !ticker) {
      dispatch({ type: "SET_COMPANY", payload: { ticker: tickar } })
    }
  }, [tickar])
  useEffect(() => {
    if (keyMetricsRef.current) {
      console.log(keyMetricsRef.current.offsetHeight, "hhhhhight")
    }
  }, [keyMetricsRef.current])


  return (
    <>
      {tickar &&
        <>



          <div className="grida" style={{ width: "100%" }}>
            <Paper
              className="chart"
            >
              <CompanyChart ref={ref} ticker={tickar} />
            </Paper>
            <Paper
              className="stock-shop">
              <StockShop ticker={tickar} />
            </Paper>
            <Paper
              className={clasi ? "general overflown" : "general"}
              style={clasi ? { height: `${listHeight + 30}px` } : {height: "100%"}}
              ref={keyMetricsRef}
            >
              <button onClick={() => { setClasi(prev => !prev) }}>change view</button>
              <KeyMetrics
                setListHeight={setListHeight}
                ticker={tickar}
              />
            </Paper>
            <BottomSection ticker={tickar} />
          </div>
        </>
      }
    </>
  );
});

