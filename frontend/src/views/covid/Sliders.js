import { FormControlLabel, makeStyles, Radio, RadioGroup, Slider } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { dragElement } from "./Draggable"
const useStyles = makeStyles({
    root: {
        display: "flex",
        height: "100%"
    },
    slider: {
        margin: "0 1.5rem"
    },
    valueLabel: {
        transform: "scale(1)",
        top: 0,
        left: "1.5rem"
    }
})

export const Sliders = ({ setDate, setMode }) => {

    const [day, setDays] = useState(25)
    const [month, setMonth] = useState(2)
    const [year, setYear] = useState(2020)
    const lastChosenYear = useRef(2020)
    const sliderDay = useRef(null)
    const [value, setValue] = useState("relative")
    

    const handleDaySlider = (e, newVal) => {
        e.preventDefault()
        setDays(newVal)
    }
    const handleMonthSlider = (e, newVal) => {
        e.stopPropagation()
        setMonth(newVal)
    }
    const handleYearSlider = (e, newVal) => {
        e.stopPropagation()
        setYear(newVal)
    }
    const childnum = useRef(0)
    const recursivadorStyle = (item) => {
        childnum.current++
        console.log(childnum.current)
        try {
            Array.from(item.children).forEach(itam => {
                if (!itam.classList.contains("MuiSlider-valueLabel")) {
                    if (childnum.current === 1) {
                        itam.style.transform = "rotate(45deg)"
                    }
                    else if (childnum.current === 2) {
                        itam.style.transform = "rotate(-45deg)"
                    }
                }
                recursivadorStyle(itam)
            })
        }
        catch (err) {
            console.log("child without descendants, lets")
        }
    }

    useEffect(() => {
        if (sliderDay.current) {
            Array.from(sliderDay.current.children).forEach(item => {
                if (item.classList.contains("MuiSlider-thumb")) {
                    Array.from(item.children).forEach(item => {
                        recursivadorStyle(item)
                    })
                }
            })
        }
    }, [sliderDay])

    useEffect(() => {
        if (value) {
            setMode(value)
        }
    }, [value])

    const dateBuider = (month, day, year) => {
        let dayc = day.toString().length < 2 ? `0${day.toString()}` : day.toString()
        let monthc = month.toString().length < 2 ? `0${month.toString()}` : month.toString()

        return `${year}-${monthc}-${dayc}`
    }

    

    useEffect(() => {
        if (year === lastChosenYear.current) {
            setDate(dateBuider(month, day, year))
        } else {
            setDays(1)
            setMonth(1)
        }
        lastChosenYear.current = year
    }, [month, day, year])
    const classes = useStyles()

    return (
        < 
        >
            <div className="dates"
            
            >
                <Slider
                    ref={sliderDay}
                    orientation="vertical"
                    //getAriaValueText={valuetext}
                    value={day}
                    min={1}
                    max={marks[month - 1].days}
                    onChange={handleDaySlider}
                    valueLabelDisplay="on"
                    defaultValue={30}
                    aria-labelledby="vertical-slider"
                    marks
                    classes={{ root: classes.slider, valueLabel: classes.valueLabel }}
                />
                <Slider

                    orientation="vertical"
                    min={1}
                    max={12}
                    value={month}
                    marks={marks}
                    onChange={handleMonthSlider}
                    valueLabelDisplay="off"
                    defaultValue={30}
                    aria-labelledby="vertical-slider"
                    classes={{ root: classes.slider }}
                />
                <Slider
                    style={{ height: "50%" }}
                    orientation="vertical"
                    min={2020}
                    max={2021}
                    value={year}
                    marks={marksYear}
                    onChange={handleYearSlider}
                    valueLabelDisplay="off"
                    defaultValue={30}
                    aria-labelledby="vertical-slider"
                    classes={{ root: classes.slider }}
                />
            </div>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={(e) => { setValue(e.target.value) }} style={{ flexDirection: "row" }}>
                <FormControlLabel value="absolute" control={<Radio />} label="absolute" />
                <FormControlLabel value="relative" control={<Radio />} label="relative" />
            </RadioGroup>
        </>
    )
}

const marksYear = [
    {
        label: 2020,
        value: 2020
    },
    {
        label: 2021,
        value: 2021
    }
]
const marks = [
    {
        name: "January",
        label: "Jan",
        value: 1,
        days: 31,
    },
    {
        name: "February",
        label: "Feb",
        value: 2,
        days: 28
    },
    {
        name: "March",
        label: "Mar",
        value: 3,
        days: 31
    },
    {
        name: "April",
        label: "Apr",
        value: 4,
        days: 30
    },
    {
        name: "May",
        label: "May",
        value: 5,
        days: 31
    },
    {
        name: "June",
        label: "Jun",
        value: 6,
        days: 30
    },
    {
        name: "July",
        label: "Jul",
        value: 7,
        days: 31
    },
    {
        name: "August",
        label: "Aug",
        value: 8,
        days: 31
    },
    {
        name: "September",
        label: "Sep",
        value: 9,
        days: 30
    },
    {
        name: "October",
        label: "Oct",
        value: 10,
        days: 31
    },
    {
        name: "November",
        label: "Nov",
        value: 11,
        days: 30
    },
    {
        name: "December",
        label: "Dec",
        value: 12,
        days: 31
    }
]