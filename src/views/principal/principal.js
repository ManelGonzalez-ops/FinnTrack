//last news, market sentiment, principal indexes

import React from 'react'
import { Searcher } from '../../components/Searcher'
import { Gainers } from './elements/Gainers'
import { Indices } from './elements/Indices'
import { News } from './elements/News'
import { Sectors } from './elements/Sectors'

export const Principal = ({setSelection}) => {
    return (
        <>
        <Gainers/>
        <Searcher setSelection={setSelection}/>
        <div className="p-grid"> 
            <div className="p-left">
                <News />
            </div>
            <div className="p-right-top">
                <Sectors/>
            </div>
            {/* <div className="p-right-bottom">
                <Indices/>
            </div> */}
        </div>
        </>
    )
}
