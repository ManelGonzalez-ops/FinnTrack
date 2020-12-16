import React, { useEffect, useRef } from 'react'
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import worldMap from "@highcharts/map-collection/custom/world.geo.json"
import { useUILayer } from "../ContextUI"
export const CovidMap = ({ data }) => {

    console.log(worldMap, "puta higcharts")
    const { sidebarOpen } = useUILayer()
    const covidMap = useRef(null)
    useEffect(() => {
        console.log("ahoora")
        if(covidMap.current && Object.keys(covidMap.current).length > 0){
            setTimeout(()=>{
                covidMap.current.reflow()
            },600)
        }
    }, [sidebarOpen])
    const mapOptions = {
        chart: {
            // width: 1000,
            
           
            events: {
                load: function(){
                    covidMap.current = this
                }
            }
        },
        title: {
            text: "",
        },
        colorAxis: {
            min: 0,
            // stops: [
            //     [0.4, "#ffff00"],
            //     [0.65, "#bfff00"],
            //     [1, "#40ff00"],
            // ],

        },
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },
        plotOptions: {
            animation: true,
        }
        ,
        series: [
            {
                mapData: worldMap,
                data: data,
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.postal-code}'
                }
            },
        ],
        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textOutline: '1px #000000'
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    };

    return (
        <div style={{display: "grid" , height: window.innerHeight,}}>
            {
                data.length > 0 &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={mapOptions}
                    constructorType={"mapChart"}
                />}
        </div>
    )
}

var data = [
    ["ae", 37],
    ["af", 44],
    ["am", 20],
    ["az", 19],
    ["bd", 9],
    ["bh", 12],
    ["bn", 43],
    ["bt", 26],
    ["cn", 70],
    ["cnm", 33],
    ["cy", 48],
    ["ge", 27],
    ["id", 65],
    ["il", 29],
    ["in", 65],
    ["iq", 36],
    ["ir", 70],
    ["jk", 40],
    ["jo", 31],
    ["jp", 100],
    ["kg", 52],
    ["kh", 25],
    ["kp", 45],
    ["kr", 70],
    ["kw", 35],
    ["kz", 28],
    ["la", 38],
    ["lb", 46],
    ["lk", 51],
    ["mm", 13],
    ["mn", 34],
    ["my", 18],
    ["nc", 47],
    ["np", 50],
    ["om", 5],
    ["ph", 1],
    ["pk", 39],
    ["qa", 41],
    ["ru", 70],
    ["sa", 2],
    ["sg", 65],
    ["sh", 17],
    ["sp", 10],
    ["sy", 30],
    ["th", 4],
    ["tj", 22],
    ["tl", 24],
    ["tm", 32],
    ["tr", 65],
    ["tw", 49],
    ["uz", 23],
    ["vn", 21],
    ["ye", 6],
    ["es", 90],
];