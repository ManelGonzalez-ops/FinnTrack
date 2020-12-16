import React from 'react'
import { Linechart } from '../charts/linechart';
import { useFetch } from '../utils/useFetch';

export const Gainer = ({ ticker }) => {
    // const { ticker } = data
    const url = `http://localhost:8001/prices/${ticker}`;
    const hookOptions = {
        explicitUrl: true
    }
    const { datos, loading, error } = useFetch(url, ticker, "prices", hookOptions);
    console.log(datos, "ka pacha")
    // we use Linehart chart as it is a standard chart
    return (
        <>
            {datos.data && datos.data.length > 0 &&
                <Linechart
                    data={datos.data.slice(datos.data[0].length / 2, datos.data[0].length)}
                />
            }
        </>
    )
}
