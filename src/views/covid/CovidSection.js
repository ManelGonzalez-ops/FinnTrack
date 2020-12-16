import React, { useEffect, useState } from 'react'
import { CovidMap } from '../../charts/CovidMap'

export const CovidSection = () => {
    const [datos, setDatos]= useState([])

    useEffect(()=>{
        const fetcher = async()=>{
            const rawData = await fetch("https://api.covid19api.com/summary")
            const data = await rawData.json()
            let countryArr = []
            data.Countries.forEach(({CountryCode, TotalConfirmed})=>{
                //console.log(pais, "pais")
                console.log(CountryCode)
                 countryArr = [...countryArr, [CountryCode.toLowerCase(), TotalConfirmed]]
             })
            //console.log(data.Countries)
            setDatos(countryArr)
        }
        fetcher()
    },[])
    console.log(datos, "data")
    return (
        <CovidMap
        data={datos}
        />
    )
}
