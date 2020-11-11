//last news, market sentiment, principal indexes

import React from 'react'
import { Gainers } from './elements/Gainers'
import { Indices } from './elements/Indices'
import { News } from './elements/News'
import { Sectors } from './elements/Sectors'

export const Principal = () => {
    return (
        <div className="p-grid">
            <div className="header gainers">
                <Gainers/>
            </div>
            <div className="p-left">
                <News />
            </div>
            <div className="p-right-top">
                <Sectors/>
            </div>
            <div className="p-right-bottom">
                <Indices/>
            </div>
        </div>
    )
}
