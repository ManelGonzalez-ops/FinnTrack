import React, {useEffect, useState} from 'react'
import {Company} from "./Company";


export const Selections = ({ companies, dispatch }) => {

    return (
        <ul>
            {
                companies.map(({minDate,ticker, maxDate, price, amount,operationType }) => (
                    <Company {...{dispatch, minDate,ticker, maxDate, price, amount,operationType}} />
                ))
            }
        </ul>
    )
}
