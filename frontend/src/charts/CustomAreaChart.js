import React, { useEffect, useState } from "react";
// Import Highcharts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDataLayer } from "../Context";


//very similar to MiniatureChartIndex

export const CustomAreaChart = ({ datos, ticker }) => {
    const {state, dispatch} = useDataLayer()
    const [data, setData] = useState("")
    useEffect(() => {
        if (datos.length > 0) {
            // dispatch({type: "ADD_READY_PORTFOLIO_COMPANY_HISTORICAL_PRICE", payload: datos})
            const shortDatos = handleDatasetLength(datos)
            console.log(shortDatos, "shortdatos")
            setData(shortDatos)
        }
    }, [datos])

    console.log(data, "dataaau")

    const handleDatasetLength = (dataset) => {
        const sobras = dataset.length - 365
        console.log(sobras, "sobras")
        if (sobras <= 0) {
            return dataset
        }
        return dataset.slice(dataset.length - 365, dataset.length)
    }

    const chartOptions = {
        chart: {
            margin: [0, 0, 0, 0],
            height: '100%',
            spacing: [0, 0, 0, 0],
            borderWidth: 0,
            crisp: false,
            type: "areaspline",
            animation: false
            //width: 50 
        },
        title: {
            //enabled: false,
            text: ticker
        },
        series: [{
            name: ticker,
            //we display just the last year
            data: data,
            //color: 'linear-gradient(to top, #c6ffdd, #fbd786, #f7797d);',
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#FF0080'],
                    [1, '#FFFFFF']
                ]
            }
            
        }],
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
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
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
    };

    return (
        <>
            {
                data &&
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType="chart"
                    options={chartOptions}
                    containerProps={{style:{overflow: "hidden"}}}
                />
            }
        </>)
}
