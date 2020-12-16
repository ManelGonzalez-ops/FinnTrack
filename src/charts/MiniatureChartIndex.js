import React, { useEffect, useState } from "react";
// Import Highcharts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


//require("highcharts/modules/exporting")(Highcharts);
export const MiniatureChart = ({ datos }) => {
    const [data, setData] = useState("")
    const prepareData = (datus) => {
        const dataset = datus.map(record => record.close)
        setData(dataset)
    }
    useEffect(() => {
        if (datos.prices && datos.prices.length > 0) {
            prepareData(datos.prices)
        }
    }, [datos])
    const chartOptions = {
        chart: {
            type: "spline",
            margin: 0,
            height: (9 / 16 * 100) + '%',
            //width: 50 
        },
        title: {
            text: ""
        },
        series: [{
            name: 'Tokyo',
            data: data,
            color: '#3f51b5'

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
        <>{data && <HighchartsReact
            highcharts={Highcharts}
            constructorType="chart"
            options={chartOptions}
        />}
        </>)
}
