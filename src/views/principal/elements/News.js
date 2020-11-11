import React, { useEffect } from 'react'
import { useFetch } from '../../../utils/useFetch'

export const News = () => {

    const {data, loading, error} = useFetch("http://localhost:8001/news", null, true)
    
    return (
        <>
            {loading && <p>loading...</p>}
    {error && <p>{error}</p>}
    {data && data.map(item=><p>{JSON.stringify(item, 2, null)}</p>)}
        </>
    )
}

