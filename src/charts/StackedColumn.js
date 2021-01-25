import React, { useState, useEffect, useReducer } from 'react'
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official";

const initialState = {
    data: "",
    loading: false,
    error: ""
}
const dataReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_LOADING":
            return {
                ...state,
                loading: false,
            }
        case "REQUEST_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case "REQUEST_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}
export const StackedColumn = ({ ticker }) => {
    const [{ data, loading, error }, dispatch] = useReducer(dataReducer, initialState)
    const fetchData = () => {
        dispatch({ type: "REQUEST_LOADING" })
        fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=btm6dp748v6ud360stcg`)
            .then(res => res.json())
            .then(res => {
                const dataCurrentYear = getCurrentYear(res)
                if (dataCurrentYear.length) {
                    dispatch({ type: "REQUEST_SUCCESS", payload: dataCurrentYear.reverse() })
                } else {
                    dispatch({ type: "REQUEST_ERROR", payload: "No data available" })
                }
            })

    }
    const getCurrentYear = (arr) => {
        return arr.filter(item => item.period.split("-")[0] === "2020")
    }
    useEffect(() => {
        fetchData()
    }, [])

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stacked column chart'
        },
        xAxis: {
            categories: data && data.map(item => item.period)
        },
        yAxis: {
            min: 0,
            title: {
                text: 'stock recommendations'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        // series: [{
        //     name: 'John',
        //     data: [5, 3, 4, 7, 2]
        // }, {
        //     name: 'Jane',
        //     data: [2, 2, 3, 2, 1]
        // }, {
        //     name: 'Joe',
        //     data: [3, 4, 4, 2, 5]
        // }]
        series:
            data &&
            Object.keys(data[0])
                .filter(item => item !== "period")
                .map(field => (
                    {
                        name: field,
                        data: data.map(item => item[field])
                    }
                ))

    }
    return (
        <>
            {
                data && <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />}
        </>
    )
}
