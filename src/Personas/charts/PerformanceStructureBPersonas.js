import React, { useEffect, useState, useRef } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Paper } from '@material-ui/core';
import { convertHumanToUnixInit } from '../../utils/datesUtils';


export const PerformanceStructureBPersonas = ({ companiesImpact }) => {
    const [chartData, setChartData] = useState()
    const [loading, setLoading] = useState(false)
    //const [availableTomorrow, setAvailableTomorrow] = useState(false)

    const prepareDataset = () => {
        let readyData = {}
        Object.keys(companiesImpact).forEach(date => {
            companiesImpact[date].forEach(asset => {
                if (readyData[asset.ticker] === undefined) {
                    readyData = {
                        ...readyData,
                        [asset.ticker]: []
                    }
                }
                const unixDate = convertHumanToUnixInit(date)
                //we are clasifying "other" as a ticker/category
                const isThereAndRelevant = companiesImpact[date].find(item => item.ticker === asset.ticker)
                if (isThereAndRelevant) {
                    readyData[asset.ticker] = [
                        ...readyData[asset.ticker],
                        [unixDate, isThereAndRelevant.performance]
                    ]
                }

            })
        })
        console.log(readyData, "ruuudi")
        if (readyData.other && readyData.other.length > 0) {
            //if sum of all others is less than absolute 0.1 we won't show category other for that date neither
            const relevantOthers = readyData.other.filter(item => Math.abs(item[1]) > 0.1)
            readyData = { ...readyData, relevantOthers }
        }
        return readyData
    }

    const prepareForChart = (data, cb) => {
        let readySeries = []
        Object.entries(data).forEach(assetData => {
            const ticker = assetData[0]
            const data = assetData[1]
            readySeries = [...readySeries,
            {
                type: "column",
                name: ticker,
                data
            }
            ]
        })
        cb(readySeries)
    }
    useEffect(() => {
        // console.log(companiesImpact, generatedSeries, "sorios")
        // if (!companiesImpact.ready || !generatedSeries.ready) {
        //     setLoading(true)
        //     return
        // }
        // if (!companiesImpact.data) {
        //     setLoading(false)
        //     setAvailableTomorrow(true)
        // }


        setLoading(false)
        const data = prepareDataset()
        prepareForChart(data, (result) => {
            setChartData(result)
        })

    }, [])

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
            column: {
                stacking: "normal"
                // centerInCategory: true,
            },
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
        series: chartData
    }
    return (
        <Paper>
            {loading && <p>Loading...</p>}
            {/* {availableTomorrow && <p>Data is not available untill next day after you submited a operation, if you submited in weekend wait till monday</p>} */}

            { chartData && <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={"stockChart"}
            />}
        </Paper>
    )
}
