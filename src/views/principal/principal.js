//last news, market sentiment, principal indexes

import React from 'react'
import { Searcher } from '../../components/Searcher'
//import { Gainers } from './elements/Gainers'
import { Indices } from './elements/Indices'
import { News } from './elements/News'
import { Sectors } from './elements/Sectors'

const titleStyles = {
    marginTop: 0,
    marginBottom: "10px"
}

export const Principal = ({ setSelection }) => {
    return (
        <>
            {/* <Gainers /> */}
            <Searcher setSelection={setSelection} />
            <div className="p-grid">
                <div className="p-left radius">
                    <h3 style={titleStyles}>destacated News</h3>
                    <News classnames="principal-section"/>
                </div>
                <div className="p-right-top radius">
                    <h3 style={titleStyles}>Sector Performance</h3>
                    <Sectors classnames="principal-section"/>
                </div>
                {/* <div className="p-right-bottom">
                <Indices/>
            </div> */}
            </div>
        </>
    )
}
