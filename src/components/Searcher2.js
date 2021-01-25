import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components'

export const Searcher2 = () => {
    const [value, setValue] = useState("")
    const [shownValue, setShownValue] = useState("")
    const valueRef = useRef("")
    const Paragrafo = styled.p`
    height: 100%;
    position: absolute;
    width: 100%;
    background: lightblue;
    /* overflow-x: scroll; */
    position: absolute;
    top: 0;
    left: 0;
    font-size: 35px;

    &:after{
        content:"";
        width: 5px;
        height: 70%;
        background: black;
        position: absolute;
        animation: blink 1.2s ease infinite;
        text-align: left;
        opacity: 0;
        transform: translateX(2px);
        white-space: pre
    }
    `
    const handleKeyDown = (e) => {
        console.log(e.key, "tecla")

        if (e.key === " ") {
            setShownValue(prev => prev + '\u00A0')
        }
        if (e.key === "Backspace") {
            console.log("borrando")
            setShownValue(prev => prev.slice(0, prev.length - 1))
            
        }
    }
    useEffect(() => {
        if (value && value.split("").pop() !== " " && value >= valueRef.current) {
            setShownValue(prev => prev + value.split("").pop())
        }
        valueRef.current = value
    }, [value])


    return (
        <div className="searcher2">
            <Paragrafo>{shownValue}</Paragrafo>
            <input id="transparent" type="text"
                value={value} onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
