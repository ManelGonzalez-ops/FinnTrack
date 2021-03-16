import React, { useState, useEffect } from 'react'
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official";

export const DonutChart = ({data}) => {
    const chartOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: undefined,
        },
        plotOptions: {
            pie: {
                innerSize: 100,
            }
        },
        series: [{
            name: 'Delivered amount',
            data
        }]
        // series: [{
        //     name: 'Delivered amount',
        //     data: [
        //         ['Bananas', 8],
        //         ['Kiwi', 3],
        //         ['Mixed nuts', 1],
        //         ['Oranges', 6],
        //         ['Apples', 8],
        //         ['Pears', 4],
        //         ['Clementines', 4],
        //         ['Reddish (bag)', 1],
        //         ['Grapes (bunch)', 1]
        //     ]
        // }]
    }
    return (
        <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        />
    )
}
