import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useFetch } from "../../utils/useFetch";
import { useParams } from "react-router-dom";
import { CompanyOverview } from "./CompanyOverview";
import { Paper, Typography } from "@material-ui/core";
import { ContactSupportOutlined } from "@material-ui/icons";
import { TableUI } from "./TableUI";
import { KeyMetrics } from "./KeyMetrics";

export const StockChartt = React.forwardRef(({ width }, ref) => {
  const url = "http://localhost:8001/prices";
  const { company } = useParams();
  const AdjustedPrices = useRef(null);
  const notAdjustedPrices = useRef(null);
  const [aproved, setAproved] = useState(false);
  //we dont inicialize chart till data is ready because highchart is soo unreliable with updates
  const [dataset, setDataset] = useState(null);
  const [income, setIncome] = useState("")
  // const [datos, setDatos] = useState("")

  // useEffect(() => {
  //   const storedData = localStorage.getItem(company);
  //   if (!storedData) {
  //     setAproved(true);
  //   } else {
  //     setDataset(JSON.parse(storedData));
  //   }
  // }, []);
  const { datos, loading, error } = useFetch(url, company, "prices");
  // useEffect(()=>{
  //   fetch("http://localhost:8001/prices/" + company)
  //   .then(res=>res.json())
  //   .then(({data})=>{setDatos(data)})
  //   .catch(err=>{console.log(err, "errorrrrr")})
  // },[])

  console.log(datos, "rerenderr")
  const num = useRef(0)
  num.current = num.current++

  useEffect(() => {
    console.log("queeeeeeee", datos.length, typeof datos)
    if (datos && datos.length > 0) {
      console.log(datos, "diita");
      const cleanData = datos.map((item) => {
        const date = item.date.split("T")[0];
        const actualDate = date.split("-").map((val) => parseInt(val));
        const formatedDate = new Date(
          actualDate[0],
          actualDate[1],
          actualDate[2]
        );
        const unixTime = formatedDate.getTime();
        item.date = unixTime;
        return item;
      });
      prepareData(cleanData);
    }
  }, [datos]);

  const prepareData = (data) => {
    console.log("hola");
    let ohl = [];
    let ohlNA = [];
    let volume = [];
    data.forEach((record) => {
      let cleanRecord = [
        record["date"],
        record["adjClose"],
        record["adjHigh"],
        record["adjLow"],
        record["adjOpen"],
      ];
      let cleanRecordNoAdjusted = [
        record.date,
        record.close,
        record.high,
        record.low,
        record.open,
      ];

      ohl = [...ohl, cleanRecord];
      ohlNA = [...ohlNA, cleanRecordNoAdjusted];
    });
    console.log("ooooohl", ohl);
    localStorage.setItem(company, JSON.stringify(ohl));
    setDataset(ohl);
    AdjustedPrices.current = ohl;
    //need to add them into localStorage
    notAdjustedPrices.current = ohlNA;
  };

  console.log(width, "wiiidth")

  const handleGetIncome = () => {
    fetch(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${company}&apikey=btm6dp748v6ud360stcg`)
      .then(res => res.json())
      .then(res => { setIncome(res) })
      .catch(err => { console.log(err.message) })
  }

  const options = {
    chart: {
      zoomType: "x",
      events: {
        selection: function (e) {
          e && console.log(e);
        },
      },
      width,
      animation: {
        duration: 225,
      },
    },
    plotOptions: {
      candlestick: {
        color: "red",
        upColor: "rgb(22,177,87)",
        lineColor: "red",
        upLineColor: "rgb(22,177,87)",
        pointPadding: 0.02,
      },
    },

    title: {
      text: "My chart",
      zoomType: "x",
    },
    rangeSelector: {
      allButtonsEnabled: true,
    },
    navigator: {},
    series: [
      {
        type: "candlestick",
        data: dataset,
        dataGrouping: {
          units: [
            ["day", [1, 2, 3, 4, 5, 8, 16]],
            ["week", [1, 2, 3, 4]],
            ["month", [1, 2, 3, 4, 6]],
          ],
          smoothed: true,
        },
        // showInNavigator: true,
      },
    ],
  };
  console.log(income, "incooome")

  return (
    <>
      <div className="grida" style={{ width: "100%" }}>
        <Paper ref={ref}
          className="chart"
        >
          {
            dataset &&
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              constructorType={"stockChart"}

            />}
        </Paper>
        <Paper
          className="general"
        >
          <div>
            <KeyMetrics
              ticker={company}
            />
          </div>
        </Paper>

        <CompanyOverview ticker={company} />
      </div>
      <button
        onClick={() => {
          setDataset(notAdjustedPrices.current);
        }}
      >
        Not adjusted prices
      </button>
      <button
        onClick={() => {
          setDataset(AdjustedPrices.current);
        }}
      >
        adjusted prices
      </button>
      <button onClick={handleGetIncome} >See income</button>
      {/* {loading && <p>cargando...</p>}
      {error && <p>{error}</p>} */}
      <TableUI data={income} />
    </>
  );
});
// const fechar = async()=>{
//   try{
//     const data = await fetch("https://demo-live-data.highcharts.com/aapl-ohlcv.json")
//     return await data.json()
//   }
//   catch(err){
//     console.log(err, "err")
//   }

// }
