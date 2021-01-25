import React, { useEffect, useState, useRef } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useDataLayer } from '../Context';
import { convertHumanToUnixInit, convertUnixToHuman, milisencondsInADay } from '../utils/datesUtils';
import { rounder } from '../utils/numFormatter';
import { Paper } from '@material-ui/core';


export const PerformanceStructure = () => {
    const [dataReady, setDataReady] = useState("")
    const { state, dispatch } = useDataLayer()
    const { areHistoricPricesReady, areGeneratedSeriesReady, companiesChange } = state
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
        // const getFirstDate = () => {
        //     const firstOperation = state.userActivity.find(item => item.isFirstOperation === true)
        //     let initialDate = firstOperation.date
        //     if (state.portfolioHistory[initialDate] === undefined) {
        //         const unixInitialDate = convertHumanToUnixInit(initialDate)
        //         let found = false
        //         let unixPreviousDate = unixInitialDate
        //         while (!found) {
        //             unixPreviousDate -= milisencondsInADay
        //             const previousDate = convertUnixToHuman(unixPreviousDate)
        //             if (state.portfolioHistory[previousDate] !== undefined) {
        //                 initialDate = previousDate
        //                 found = true
        //             }
        //         }
        //     }
        //     Object.keys(state.portfolioHistory)
        // }
        const generateSeries = () => {
            let result = {}
            //inicialize our object with ticker keys as empty arr
            state.currentPossesions.stocks.forEach(({ ticker }) => {
                result = {
                    ...result,
                    [ticker]: []
                }
            })
            let change = 0
            //aqui deberiamos cojer solo las que tienen mayor % peso
            //ojo al generatedSeries que puede que no se haya creao aun
            Object.keys(state.generatedSeries.dates).forEach(date => {
                if (state.portfolioHistory[date] !== undefined) {
                    let unixDate = convertHumanToUnixInit(date)
                    Object.keys(state.portfolioHistory[date]).forEach(ticker => {
                        const wasInPort = state.generatedSeries.dates[date].positions.find(item => ticker === item.ticker)
                        if (wasInPort) {

                            const { close } = state.portfolioHistory[date][ticker]
                            const prevDayPrice = result[ticker] && result[ticker].length > 0 && result[ticker][result[ticker].length - 1][2]
                            if (prevDayPrice) {
                                change = (close - prevDayPrice) * 100 / prevDayPrice
                            }
                            result = {
                                ...result,
                                [ticker]:
                                    [
                                        ...result[ticker],
                                        [unixDate, rounder(change), close]
                                    ]
                            }
                        }
                    })
                }
            })
            return result
        }
        if (areHistoricPricesReady && areGeneratedSeriesReady) {
            const dataset = generateSeries()
            dispatch({type:"STORE_COMPANIES_CHANGE", payload: dataset})
            console.log(dataset, "reeeesullt")
            const _dataReady = prepareDataset(dataset)
            setDataReady(_dataReady)
        }
    }, [areHistoricPricesReady, areGeneratedSeriesReady])


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
    return (
        <Paper className="performance-chart1">
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
