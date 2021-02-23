import React, { useState, useEffect, useRef } from 'react'
import Highcharts, { chart } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useChartReflow } from '../utils/useChartReflow';
import { Paper } from '@material-ui/core';

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

export const PortfolioPriceChart = ({ datos, title }) => {

    const chart = useRef(null)
    useChartReflow(chart.current)

    const [dataset, setDataset] = useState("")
    const [availableTomorrow, setAvailableTomorrow] = useState(false)

    //la fecha de la grafica siempre es un dia menos respecto a las generatedseries

    const prepareData = () => {
        let cleanData = []
        Object.keys(datos).forEach(date => {
            console.log(date, "duuta")
            const actualDate = date.split("-").map((val) => parseInt(val));
            const formatedDate = new Date(
                actualDate[0],
                actualDate[1] - 1,
                actualDate[2]
            );
            console.log(formatedDate, "ttiiimo")
            const unixTime = formatedDate.getTime();
            console.log(new Date(unixTime), "huuuuuuuuuue")
            cleanData.push({ ...datos[date], date: unixTime })
        })
        const readyData = cleanData.map(item => ([item.date, item.liquidativeValue]))
        console.log(readyData, "dataridi")
        setDataset(readyData)
    }
    useEffect(() => {
        if (datos) {
            prepareData(datos)
        } else {
            setAvailableTomorrow(true)
        }

    }, [datos])

    const options = {
        chart: {
            type: "spline",
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
            text: { title },
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
        <Paper
            className="portfolio-chart"
        >
            {availableTomorrow && <p>Data is not available untill next day after you submited a operation, if you submited in weekend wait till monday</p>}
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"stockChart"}

                />}
        </Paper>
    )
}
