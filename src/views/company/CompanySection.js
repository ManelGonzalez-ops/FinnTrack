import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BottomSection } from "./BottomSection";
import { Paper } from "@material-ui/core";
import { KeyMetrics } from "./KeyMetrics";
import { CompanyChart } from "./CompanyChart";
import { useDataLayer } from "../../Context";
import { StockShop } from "../../portfolio/StockShop";


export const CompanySection = React.forwardRef(({ width }, ref) => {

  const { state, dispatch } = useDataLayer()
  const { ticker } = state.currentCompany

  const [tickar, setTicker] = useState(ticker)
  const params = useParams()
  const location = useLocation()
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


  return (
    <>
      {tickar &&
        <>
          <div>
            <StockShop ticker={tickar} />
          </div>
          <div className="grida" style={{ width: "100%" }}>
            <Paper
              className="chart"
            >
              <CompanyChart ref={ref} width={width} ticker={tickar} />
            </Paper>
            <Paper
              className="general"
            >
              <div>
                <KeyMetrics
                  ticker={tickar}
                />
              </div>
            </Paper>
            <BottomSection ticker={tickar} />
          </div>
        </>
      }
    </>
  );
});

