import React, { useEffect, useState } from 'react'
import { useDataLayer } from "../../Context"
export const KeyMetrics = ({ ticker }) => {
    const [data, setData] = useState({})
    const { state } = useDataLayer()
    useEffect(() => {
        console.log(state, "hooola")
        if (state.keymetrics[ticker]) {
            Object.keys(state.keymetrics[ticker]).length > 0 && setData(state.keymetrics[ticker])
        }
    }, [state])
    return (
        <ul>
            {Object.keys(data).length > 0 &&
                Object.keys(data).map(field => (
                    <li>
                        {field}
                        <span>{data[field]}</span>
                    </li>
                ))
            }
        </ul>
    )
}
