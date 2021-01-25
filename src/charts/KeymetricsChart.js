import React, { useEffect, useRef, useState } from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useParams } from "react-router-dom"
import { useFetch } from '../utils/useFetch';
import { Multioption } from '../components/Multioption';
//those are historical
export const KeymetricsChart = () => {
    const { company } = useParams()
    const url = `https://financialmodelingprep.com/api/v3/key-metrics/${company.toUpperCase()}?apikey=651d720ba0c42b094186aa9906e307b4`
    
    const [dataset, setDataset] = useState({})
    const hookOptions = {
        explicitUrl: true
    }


    const [chosenFields, setChosenFields] = useState(
        ["tangibleBookValuePerShare", "shareholdersEquityPerShare", "interestDebtPerShare"])

    const { datos, loading, error } = useFetch(url, company, "metricsHistorical", hookOptions)
    useEffect(()=>{
        fetch("https://financialmodelingprep.com/api/v3/key-metrics/AMZN?apikey=651d720ba0c42b094186aa9906e307b4")
        .then(res=>res.json())
        .then(resa=>{console.log(resa, "resa")})
        .catch(err=>{console.log(err, "puto error")})
    },[])

    const datasetBuilder = (data) => {
        let masterObject = {}
        Object.keys(data[0]).forEach(item => {
            masterObject[item] = []
        })
        data.forEach(record => {
            Object.keys(record).forEach(item => {
                masterObject[item] = [...masterObject[item], record[item]]
            })
        })
        console.log(masterObject, "master")
        return masterObject
    }
    useEffect(() => {
        console.log("momop", datos, datos.length)
        if (datos.length > 0) {
            console.log("momo")
            let readyData = datasetBuilder(datos)
            setDataset(readyData)
        }
    }, [datos])


    console.log(datos, "mammmmma")

    const options = {
        chart: {
            type: "spline"
        },
        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },

        // subtitle: {
        //     text: 'Source: thesolarfoundation.com'
        // },

        // yAxis: {
        //     title: {
        //         text: 'Number of Employees'
        //     }
        // },

        // xAxis: {
        //     accessibility: {
        //         rangeDescription: 'Range: 2014 to 2017'
        //     }
        // },
        // xAxis: [{
        //     labels: {
        //         formatter: function () {
        //             const arr = dataset.date[0].split("-")
        //             const arrint = arr.map(item=>parseFloat(item))
        //             return Highcharts.dateFormat('%Y %M %d', new Date(arrint));
        //         }
        //     }
        // }],
        xAxis:{
            allowDecimals: false
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom'
        },
        height: 500,
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2014
            }
        },
        series: Object.keys(dataset).length > 0 && chosenFields.map(field => {
            console.log(dataset, "dooota")
            return ({
                name: field,
                data: dataset[field]
            }
            )
        })
        ,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'vertical',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }

    return (
        <div>
            {loading && <p>laoding...</p>}
            {error && <p>{error}</p>}
            {Object.keys(dataset).length > 0 &&
                <div style={{ display: "flex", marginTop: "100px", height: "550px", justifyContent: "flexEnd" }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        containerProps={{ style: { flex: 1 } }}
                    />
                    <Multioption
                        fields={dataset}
                        setChosenFields={setChosenFields}
                        chosenFields={chosenFields}
                    />
                </div>
            }

        </div>
    )
}


