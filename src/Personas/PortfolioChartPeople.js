import React, { useState, useEffect, useRef } from 'react'
import Highcharts, { chart } from "highcharts";
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

//tenemos que usar otra grafica para la vista details de este grafico para solucionar setCurrentPerformance errror
export const PortfolioChartPeople = ({ datos, title, setCurrentPerformance }) => {

    const chart = useRef(null)
    //useChartReflow(chart.current)
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
            const unixTime = formatedDate.getTime();
            if (!index) {
                firstDate = unixTime - 1
            }
            cleanData.push({ ...datos[date], date: unixTime })
        })
        let readyData = cleanData.map(item => ([item.date, Math.floor(item.liquidativeValue)]))
        readyData = [[firstDate, 1000], ...readyData]
        getCurrentPerformance(readyData, result => {
            setCurrentPerformance(result)
        })
        //prepend first point in 1000pts in firstDate 
        if (addFirstSerie) {

        }
        setDataset(readyData)
    }

    const getCurrentPerformance = (data, cb) => {
        const lastLiquidative = data[data.length - 1][1]
        cb((lastLiquidative - 1000) / 1000 * 100)
    }

    useEffect(() => {
        if (datos) {

            prepareData(datos)

        }
    }, [datos])

    const options = {
        chart: {
            type: "areaspline",
            //zoomType: "x",
            events: {
                selection: function (e) {
                    e && console.log(e);
                },
                load: function (e) {
                    chart.current = this
                }
            },
            height: "70%",
            //width: "100%",
            //id: "chart-stock",
            animation: false,
            margin: [0, 0, 0, 0],
            //height: '100%',
            spacing: [0, 0, 0, 0],
            borderWidth: 0,
            crisp: false,
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            lineWidth: 0,
            gridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            labels: {
                enabled: false
            },
            minPadding: 0,
            maxPadding: 0
            // endOnTick: false,
            // startOnTick: false,
            // visible: false
        },
        xAxis: {

            crosshair: false, //hover effect of column
            lineWidth: 0, //removes axis line
            gridLineWidth: 0, //removes charts background line
            lineColor: 'transparent',
            minorTickLength: 0, //removes minor axis ticks 
            tickLength: 0, //removes  axis ticks 

            labels: {
                enabled: false
            },
            //this remove little padding between highhcarts container and chart
            minPadding: 0,
            maxPadding: 0
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                animation: false,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            }
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


        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },

        series: [
            {
                data: dataset,
                // dataGrouping: {
                //     units: [
                //         ["day", [1, 2, 3, 4, 5, 8, 16]],
                //         ["week", [1, 2, 3, 4]],
                //         ["month", [1, 2, 3, 4, 6]],
                //     ],
                //     smoothed: true,
                // },

                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#FF0080'],
                        [1, '#FFFFFF']
                    ]
                }
            },
        ],
    };



    return (
        <>
            {
                dataset &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"chart"}

                />}
        </>
    )
}
