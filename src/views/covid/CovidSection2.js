import { makeStyles, Slider, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { CovidMap } from '../../charts/CovidMap'
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import countryCode from "../../utils/countryCodes.json"
import { useFetchWithCors } from '../../utils/useFetchWithCors'
import { Sliders } from './Sliders'



export const CovidSection2 = () => {
    const [{ datosHuge, loadingHuge, errorHuge }, setRequest] = useState({ datosHuge: [], loadingHuge: false, errorHuge: "" })
    const blackList = ["Burma", "Diamond Princess", "Eswatini", "MS Zaandam", "East Timor", "West Bank and Gaza", "Kosovo", "Jersey"]
    const [populations, setPopulations] = useState([])

    const [date, setDate] = useState("2020-10-15")
    const [mode, setMode] = useState("relative")
    const populationNF = useRef([])

    const controller = useRef(null)
    const absolutePopulationData = useRef(null)

    const population = useFetchWithCors("http://localhost:8001/countriesPopulation", "populationByCountry")

    const findPopulation = (country) => {
        let target
        for (let register of population.data) {
            if (register.country.toLowerCase() === country.toLowerCase()) {
                target = register
            }
        }
        if (target) {
            return parseInt(target.population)
        } else {
            populationNF.current = [...populationNF.current, { country, countrypop: target }]
            return 0
        }
    }

    useEffect(() => {
        console.log(date, "feeecha")
        const fetcher = async () => {
            try {

                setRequest(prev => ({ ...prev, loadingHuge: true }))
                controller.current = new AbortController()
                const rawData = await fetch(`https://api.covid19tracking.narrativa.com/api/${date}`, {
                    "signal": controller.current.signal
                })

                const data = await rawData.json()
                console.log(data, "datota")
                let countryArr = []
                Object.keys(data.dates[date].countries).forEach((nombre) => {
                    //console.log(pais, "pais")
                    console.log(nombre)
                    if (!blackList.includes(nombre)) {
                        const pais = data.dates[date].countries
                        const population = findPopulation(nombre)
                        countryArr = [...countryArr, [countryCode[nombre].code.toLowerCase(), pais[nombre].today_confirmed, findPopulation(nombre), nombre]]
                    }

                })
                console.log(JSON.parse(JSON.stringify(countryArr)), "111joderrrr")
                const result = mode === "absolute" ?
                    countryArr.map(item => item.slice(0, 2))
                    :
                    countryArr.map(item => {
                        if (item[2] > 0) {
                            item[1] = Math.round((item[1] / item[2]) * 100000)
                            return item
                        } else {
                            return null
                        }
                    }).filter(item=>item!==null).map(item => item.slice(0, 2))
                    
                console.log(JSON.parse(JSON.stringify(result)), "joderrrr")
                console.log(populationNF, "no encontrado")
                if (!controller.current.signal.aborted) {
                    setRequest(prev => ({ ...prev, loadingHuge: false, datosHuge: result }))
                }
            } catch (err) {
                setRequest(prev => ({ ...prev, loadingHuge: false, errorHuge: err.message }))
            }
            //console.log(data.Countries)

        }
        if (loadingHuge) {
            controller.current.abort()
            console.log("aborted")
        }
        if (population.data && population.data.length > 0) {
            //ahora ponemos dentro
            fetcher()
        }
    }, [date, mode, population.data])


    console.log(datosHuge, "data")
    console.log(population, "population")

    return (
        <>

            {/* {loadingHuge && <CustomCircularProgress />} */}
            {errorHuge && <p>{errorHuge}</p>}

            <CovidMap
                data={datosHuge}
            />

            <div className="sliders-container">
                <Sliders
                    setDate={setDate}
                    setMode={setMode}
                />
            </div>

        </>
    )
}






