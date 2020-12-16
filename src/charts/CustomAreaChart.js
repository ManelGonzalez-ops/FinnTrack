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
            height: '80%',
            spacing: [0, 0, 0, 0],
            borderWidth: 0,
            crisp: false
            //width: 50 
        },
        title: {
            text: ""
        },
        series: [{
            name: ticker,
            //we display just the last year
            data: data,
            color: '#3f51b5',
            
        }],
        xAxis: {

            crosshair: false, //hover effect of column
            lineWidth: 0, //removes axis line
            gridLineWidth: 0, //removes charts background line
            lineColor: 'transparent',
            minorTickLength: 0, //removes minor axis ticks 
            tickLength: 0, //removes  axis ticks 
            title: {
                enabled: false
            },
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
                marker: {
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
                />
            }
        </>)
}
