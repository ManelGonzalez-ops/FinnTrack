import React, { useState, useEffect, useRef } from 'react'
import Highcharts, { chart } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useChartReflow } from '../utils/useChartReflow';

export const PortfolioPriceChart = ({ datos }) => {

    const chart = useRef(null)
    useChartReflow(chart.current)

    const [dataset, setDataset] = useState("")
    

    const prepareData = () => {
        let cleanData = []
        Object.keys(datos).forEach(date => {
            const actualDate = date.split("-").map((val) => parseInt(val));
            const formatedDate = new Date(
                actualDate[0],
                actualDate[1],
                actualDate[2]
            );
            const unixTime = formatedDate.getTime();
            cleanData.push({ ...datos[date], date: unixTime })
        })
        const readyData = cleanData.map(item => ([item.date, item.liquidativeValue]))
        setDataset(readyData)
    }
    useEffect(() => {
        if (datos) {
            prepareData(datos)
        }

    }, [datos])

    const options = {
        chart: {
            zoomType: "x",
            events: {
                selection: function (e) {
                    e && console.log(e);
                },
                load: function (e) {
                    chart.current = this
                }
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
        <div>
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"stockChart"}

                />}
        </div>
    )
}
