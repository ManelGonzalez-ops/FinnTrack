import React, { useState, useEffect, useRef } from 'react'
import Highcharts, { chart } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useChartReflow } from '../utils/useChartReflow';
import { Paper } from '@material-ui/core';
import { useDataLayer } from '../Context';
import { convertUnixToHuman } from '../utils/datesUtils';

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});


export const PortfolioChartPeople = ({ datos, title }) => {

    const chart = useRef(null)
    useChartReflow(chart.current)
    const { state: { addFirstSerie } } = useDataLayer()
    const [dataset, setDataset] = useState("")

    //la fecha de la grafica siempre es un dia menos respecto a las generatedseries

    const prepareData = () => {
        let cleanData = [];
        let firstDate
        Object.keys(datos).forEach((date, index) => {
            console.log(date, "duuta")
            const actualDate = date.split("-").map((val) => parseInt(val));
            const formatedDate = new Date(
                actualDate[0],
                actualDate[1] - 1,
                actualDate[2]
            );
            console.log(formatedDate, "ttiiimo")
            const unixTime = formatedDate.getTime();
            if (!index) {
                firstDate = unixTime - 1
            }
            console.log(new Date(unixTime), "huuuuuuuuuue")
            cleanData.push({ ...datos[date], date: unixTime })
        })
        let readyData = cleanData.map(item => ([item.date, item.liquidativeValue]))
        readyData = [[firstDate, 1000], ...readyData]
        //prepend first point in 1000pts in firstDate 
        if (addFirstSerie) {

        }
        console.log(readyData, "dataridi")
        setDataset(readyData)
    }


    useEffect(() => {
        if (datos) {

            prepareData(datos)

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
            height: 200,
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
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
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
        <
            //className="portfolio-chart--people"
        >
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"stockChart"}

                />}
        </>
    )
}
