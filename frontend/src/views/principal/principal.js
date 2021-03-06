//last news, market sentiment, principal indexes

import React from 'react'
import { GainersCarousel } from './elements/GainersCarousel'
import { Sectors } from './elements/Sectors'
import { TickerBar2 } from './elements/TickerBar2'
import { Searcher4 } from "../../components/Searcher4"
import { useUILayer } from '../../ContextUI'
const titleStyles = {
    marginTop: 0,
    marginBottom: "10px"
}

export const Principal = ({ setSelection }) => {
    const { mountApproval } = useUILayer()
    // if (!mountApproval) {
    //     return null
    // }
    console.log("rerendel")
    return (
        <>{
            mountApproval &&
            <>
                    <TickerBar2 />
                <div style={{marginBottom: "200px"}}>
                <GainersCarousel />
                </div>
                <Searcher4 setSelection={setSelection} />
                <div className="p-grid">
                    <div className="p-left radius">
                        <h3 style={titleStyles}>destacated News</h3>
                        {/* <News classnames="principal-section" /> */}
                    </div>
                    <div className="p-right-top radius">
                        <h3 style={titleStyles}>Sector Performance</h3>
                        <Sectors classnames="principal-section" />
                    </div>
                    {/* <div className="p-right-bottom">
                <Indices/>
            </div> */}
                </div>
                    
              
            </>}
        </>
    )
}
