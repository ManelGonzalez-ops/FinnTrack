import React from 'react'
import { useParams } from "react-router-dom"
import { BigIndex } from './BigIndex'
import { IndexesGeneral } from './IndexesGeneral'
import { Nasdaq } from './Nasdaq'
import { SP500 } from './SP500'

//queda pendiente poner el registro completo con csv 
export const IndexesController = () => {
    const { field } = useParams()
    const bigIndexes = ["sp500", "nasdaq", "dowjones"]
    console.log(field, "campu")
    return (
        <>
            {bigIndexes.includes(field) ?
                <BigIndex index={field}/>
                : <IndexesGeneral />}
        </>
    )
}
