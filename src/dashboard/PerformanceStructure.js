import React, { useEffect, useState, useRef } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useDataLayer } from '../Context';
import { convertHumanToUnixInit, convertUnixToHuman, milisencondsInADay } from '../utils/datesUtils';
import { rounder } from '../utils/numFormatter';
import { Paper } from '@material-ui/core';


export const PerformanceStructure = ({ available, loading }) => {
    const [dataReady, setDataReady] = useState("")
    const { state, dispatch } = useDataLayer()
    const { companiesChange } = state
    const data1 = useRef([])
    const data2 = useRef([])

    // useEffect(() => {

    //     initialData.forEach((item, index) => {
    //         if (index % 5 === 0) {
    //             data1.current = [...data1.current, [item[0], -Math.round(Math.random() * 100)]]
    //             data2.current = [...data2.current, [item[0], -Math.round(Math.random() * 100)]]
    //         } else {
    //             data1.current = [...data1.current, [item[0], Math.round(Math.random() * 100)]]
    //             data2.current = [...data2.current, [item[0], Math.round(Math.random() * 100)]]
    //         }
    //     })
    //     setDataset(true)
    // }, [])


    useEffect(() => {
        if (loading) {
            return
        }
        if (!available) {
            return
        }
        const _dataReady = prepareDataset(companiesChange)
        setDataReady(_dataReady)

    }, [available])


    const prepareDataset = (data) => {
        let readyData = []
        Object.entries(data).forEach(arr => {
            console.log(arr, "avoora")
            let ticker = arr[0]
            const data = arr[1].filter(point => Math.abs(point[1]) > 0.1)
            readyData = [...readyData,
            {
                type: "column",
                name: ticker,
                data,
                // centerInCategory: true
            }]
        })
        return readyData
    }

    const chartOptions = {
        chart: {
            type: "column",
            alignTicks: false,
        },

        // rangeSelector: {
        //     selected: 1
        // },

        title: {
            text: 'AAPL Stock Volume'
        },
        plotOptions: {
            // column: {
            //     centerInCategory: true,
            // },
            series: {
                dataGrouping: {
                    approximation: "average",
                    units: [[
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]]
                },
            }
        },
        //poner esto crea bugs 
        // xAxis: {
        //     categories: dataReady && dataReady.map(item => item.name)
        // },
        series: dataReady

    }

    if (loading) {
        return <p>loading...</p>
    }
    return (
        <Paper className="performance-chart1">

            {!available && <p>Data is not available untill next day after you submited a operation, if you submited in weekend wait till monday</p>}
            {
                dataReady &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={"stockChart"}

                />}
        </Paper>
    )
}
