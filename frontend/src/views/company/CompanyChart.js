import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useFetch } from "../../utils/useFetch";
import { useParams } from "react-router-dom";
import { CircularProgress, LinearProgress, Paper, Typography } from "@material-ui/core";
import { KeyMetrics } from "./KeyMetrics";
import { useDataLayer } from "../../Context";
import { CustomCircularProgress } from "../../components/components/CustomCircularProgress";
import { useChartReflow } from "../../utils/useChartReflow";


export const CompanyChart = ({ ticker }) => {
    const url = `${process.env.REACT_APP_API}/api/v1/prices/ticker`;

    const AdjustedPrices = useRef(null);
    const notAdjustedPrices = useRef(null);
    const { state, dispatch } = useDataLayer()
    //we dont inicialize chart till data is ready because highchart is soo unreliable with updates
    const [dataset, setDataset] = useState(null);

    const hookOptions = {
        explicitUrl: false
    }
    const { datos, loading, error } = useFetch(url, ticker, "prices", hookOptions);
    //const chart = useRef(null)
    const [theChart, setChart] = useState(null)
    useChartReflow(theChart)
    console.log(datos, "rerenderr")
    const num = useRef(0)
    num.current = num.current++


    useEffect(() => {

        if (datos.data && datos.data.length > 0) {
            if (typeof datos.data[0].date === "string") {

                const cleanData = datos.data.map((item) => {

                    const date = item.date.split("T")[0];
                    const actualDate = date.split("-").map((val) => parseInt(val));
                    const formatedDate = new Date(
                        actualDate[0],
                        actualDate[1] - 1,
                        actualDate[2]
                    );
                    item.date = formatedDate.getTime();

                    return item;
                });
                prepareData(cleanData);
            } else {
                //los datos ya nos vienen limpios del useFetch
                console.log("ready")
                prepareData(datos.data)
            }
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
                record["adjOpen"],
                record["adjHigh"],
                record["adjLow"],
                record["adjClose"],
            ];
            let cleanRecordNoAdjusted = [
                record.date,
                record.open,
                record.high,
                record.low,
                record.close,
            ];

            ohl = [...ohl, cleanRecord];
            ohlNA = [...ohlNA, cleanRecordNoAdjusted];
        });
        console.log("ooooohl", ohl);

        setDataset(ohl);

        AdjustedPrices.current = ohl;
        //need to add them into localStorage
        notAdjustedPrices.current = ohlNA;
    };
    //console.log(chart.current, "chaaart")

    const options = {
        chart: {
            zoomType: "x",
            events: {
                selection: function (e) {
                    e && console.log(e);
                },
                load: function () {
                    //chart.current = this
                    setChart(this)
                }
                // load: function(){
                //   setIsBuilding(false)
                // }
            },
            //width,
            id: "chart-stock",
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



    return (
        <>
            {loading && <CustomCircularProgress />}
            {loading && "loading..."}
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"stockChart"}

                />}
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
            <button >See income</button>
        </>
    )
}