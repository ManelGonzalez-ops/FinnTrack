import React from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const Linechart = ({ data }) => {

    console.log(data, "poooooooooota")
    const options = {
        // title: {
        //     text: 'Solar Employment Growth by Sector, 2010-2016'
        // },     
        
        series: [{
            data: data.map(item=>item.close),
            // data: [50, 40, 40, 30, 15, 12, 8, 22,40],
            marker: {
                enabled: false
            },
            animation: false,
        }],
        chart: {
            type: 'line',
            backgroundColor: 'black',
            plotBorderWidth: null,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            plotShadow: false,
            borderWidth: 0,
            plotBorderWidth: 0,
            marginRight: 0
        },
        tooltip: {
            userHTML: true,
            style: {
                padding: 0,
                width: 0,
                height: 0,
            },
            formatter: function () {
                return this.point.residents;
            },
        },
        title: {
            text: ''
        },
        xAxis: {
            enabled: false,
            showEmpty: false,
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            showEmpty: false,
            enabled: false
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                lineWidth: 1.5,
            },
            showInLegend: false,
            tooltip: {}
        },
        


        // responsive: {
        //     rules: [{
        //         condition: {
        //             maxWidth: 500
        //         },
        //         chartOptions: {
        //             legend: {
        //                 layout: 'vertical',
        //                 align: 'center',
        //                 verticalAlign: 'bottom'
        //             }
        //         }
        //     }]
        // }

    }

    return (
        <>
            { data && <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { height: "100%" } }}
            />}
        </>
    )
}


