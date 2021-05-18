import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BottomSection } from "./BottomSection";
import { Box, Paper } from "@material-ui/core";
import { KeyMetrics } from "./KeyMetrics";
import { CompanyChart } from "./CompanyChart";
import { useDataLayer } from "../../Context";
import { StockShop } from "../../portfolio/StockShop2";
import { CurrentPriceRP } from "../../portfolio/CurrentPriceRP";
import { useCompanyGuard } from "../../utils/useCurrentCompany";


export const CompanySection = () => {

  useCompanyGuard()
  const { state, dispatch } = useDataLayer()
  const { currentCompany: { ticker } } = state
  const [clasi, setClasi] = useState(false)
  const params = useParams()
  const keyMetricsRef = useRef(null)
  const [listHeight, setListHeight] = useState(0)


  useEffect(() => {
    if (keyMetricsRef.current) {
      console.log(keyMetricsRef.current.offsetHeight, "hhhhhight")
    }
  }, [keyMetricsRef.current])


  return (
    <>
      {ticker &&
        <>

          <div className="grida" style={{ width: "100%" }}>
            <Paper
              className="chart"
            >
              <CompanyChart ticker={ticker} />
            </Paper>
            <Box mb={2}>
              <h3>Actions</h3>
              <Paper
                className="stock-shop"
                style={{ padding: "1rem", width: "100%" }}
              >

                <CurrentPriceRP ticker={ticker}>
                  {({ currentPrice, loading, error }) => {
                    return <StockShop {...{ currentPrice, loading, error }}
                      ticker={ticker}
                      assetType="stock"
                    />
                  }}
                </CurrentPriceRP>
              </Paper>
            </Box>
            <div className="keymetrics">
              <Paper
                className={clasi ? "general overflown" : "general"}
                ref={keyMetricsRef}
              >
                <button onClick={() => { setClasi(prev => !prev) }}>change view</button>
                <KeyMetrics
                  setListHeight={setListHeight}
                  ticker={ticker}
                />
              </Paper>
            </div>
            <BottomSection ticker={ticker} />
          </div>
        </>
      }
    </>
  );
}

