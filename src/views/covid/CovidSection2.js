import { makeStyles, Slider, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'
import { CovidMap } from '../../charts/CovidMap'
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import countryCode from "../../utils/countryCodes.json"
import { useFetchWithCors } from '../../utils/useFetchWithCors'
import { dragElement } from './Draggable'
import { Sliders } from './Sliders'
import ReactDOM from "react-dom"


export const CovidSection2 = () => {
    const [{ datosHuge, loadingHuge, errorHuge }, setRequest] = useState({ datosHuge: [], loadingHuge: false, errorHuge: "" })
    const blackList = ["Burma", "Diamond Princess", "Eswatini", "MS Zaandam", "East Timor", "West Bank and Gaza", "Kosovo", "Jersey"]

    const [date, setDate] = useState("2020-10-15")
    const [mode, setMode] = useState("relative")
    const populationNF = useRef([])
    const controller = useRef(null)
    const slider = useRef("")
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

                setRequest(prev => ({ ...prev, loadingHuge: true, errorHuge: "" }))
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
                        //avoid error cause by covid api unmatched countries
                        if (countryCode[nombre] !== undefined) {
                            console.log(countryCode[nombre], nombre, "que cujuno")
                            countryArr = [...countryArr, [countryCode[nombre].code.toLowerCase(), pais[nombre].today_confirmed, findPopulation(nombre), nombre]]
                        }
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
                    }).filter(item => item !== null).map(item => item.slice(0, 2))

                console.log(JSON.parse(JSON.stringify(result)), "joderrrr")
                console.log(populationNF, "no encontrado")
                if (!controller.current.signal.aborted) {
                    setRequest(prev => ({ ...prev, loadingHuge: false, datosHuge: result }))
                }
            } catch (err) {
                if (err.message !== "The user aborted a request.") {
                    setRequest(prev => ({ ...prev, loadingHuge: false, errorHuge: `${date} not available` }))
                }
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

    useEffect(() => {
        if (slider.current) {
            console.log(slider.current, "curranti")
            dragElement(slider.current)
        }
    }, [])

    return (
        <div
            style={{ position: "relative" }}
        >

            {/* {loadingHuge && <CustomCircularProgress />} */}
            {/* {errorHuge && <p>{errorHuge}</p>} */}
            <ErrorOverlay error={errorHuge} />
            <CovidMap
                data={datosHuge}
                {...{ mode }}
            />

            <div className="sliders-container"
                ref={slider}
            >
                <Sliders
                    setDate={setDate}
                    setMode={setMode}
                />
            </div>

        </div>
    )
}
const defaultStyles = {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
    transition: "all 0.5s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}
const transitionStyles = {

    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },

}
const ErrorOverlay = ({ error }) => {

    return (

        <Transition
            in={error}
            timeout={500}
            appear={true}
            mountOnEnter
            unmountOnExit
        >
            {state => (
                <div
                    style={{ ...defaultStyles, ...transitionStyles[state] }}
                >
                    <div style={{ opacity: 0.6, width: "100%", height: "100%", background: "grey" }}></div>
                    <div style={{ position: "absolute" }}>{error}</div>
                </div>
            )}

        </Transition>
    )
}




