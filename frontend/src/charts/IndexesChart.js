import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useUILayer } from "../ContextUI";
import { useChartReflow } from "../utils/useChartReflow";


export const IndexesChart = ({ datos, name }) => {
    const chart = useRef(null)
    const [dataset, setDataset] = useState("")
    //useChartReflow(chart.current)
    useEffect(() => {
        console.log("manzana", datos.historical)
        if (datos.historical && datos.historical.length > 0) {
            console.log("entra")
            prepareData(datos.historical)

        } else {
            console.log("algo pasa, nunca deberia ejecutarse este else")
        }
    }, [datos])

    const sanitizeDates = (datar) => {
        const data = datar.slice(0).map(item => {
            const dateArr = item.date.slice(0).split("-").map(num => parseInt(num));
            item.date = new Date(dateArr).getTime();
            return item
        })
        return data
    }
    
    const prepareData = (datab) => {
        console.log(datab, "koojones que pasa")
        let data = typeof datos.historical[0].date === "string"
            ?
            sanitizeDates(datab)
            :
            datab


        console.log("hola");
        let ohl = [];
        let ohlNA = [];
        let volume = [];
        data.forEach((record) => {
            let cleanRecord = [
                record["date"],
                record["close"],
                record["high"],
                record["low"],
                record["open"],
            ];
            ohl = [...ohl, cleanRecord];
        });
        console.log("ooooohl", ohl);

        setDataset(ohl.reverse());
    };

    const options = {
        chart: {
            zoomType: "x",
            events: {
                selection: function (e) {
                    e && console.log(e);
                },
                load: function () {
                    chart.current = this
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
            text: name,
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
    console.log(dataset, "jodio")

    return (
        <>
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"stockChart"}

                />}
            <div>kaak</div>
        </>
    )
}


//  key info example
//{
//     "date" : "2020-11-17",
//     "open" : 12030.269531,
//     "high" : 12047.129883,
//     "low" : 11964.200195,
//     "close" : 11977.490234,
//     "adjClose" : 11977.490234,
//     "volume" : 4.12277E9,
//     "unadjustedVolume" : 4.12277E9,
//     "change" : -52.7793,
//     "changePercent" : -0.439,
//     "vwap" : 11996.27344,
//     "label" : "November 17, 20",
//     "changeOverTime" : -0.00439
//   }