import React, { useEffect, useState, useRef } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Paper } from '@material-ui/core';
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress';


export const PerformanceStructurePeople = ({ companiesChange, available = true }) => {
    const [dataReady, setDataReady] = useState("")

    const [loading, setLoading] = useState(true)
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
        if (companiesChange) {
            setLoading(false)
        }
        const _dataReady = prepareDataset(companiesChange)
        setDataReady(_dataReady)

    }, [companiesChange])


    const prepareDataset = (data) => {
        console.log(data, "dutitu")
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
            {!companiesChange && <CustomCircularProgress />}
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
