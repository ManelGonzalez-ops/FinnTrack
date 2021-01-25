//last news, market sentiment, principal indexes

import React from 'react'
import { Searcher } from '../../components/Searcher'
import { Searcher2 } from '../../components/Searcher2'
import { GainersCarousel } from './elements/GainersCarousel'
import { Indices } from './elements/Indices'
import { News } from './elements/News'
import { Sectors } from './elements/Sectors'
import { TickerBar2 } from './elements/TickerBar2'
//import {TickerBar2} from "./elements/TickerBar2"
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
                {/* <Searcher2/> */}
                <Searcher4 setSelection={setSelection} />
                {/* <Searcher setSelection={setSelection} /> */}
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
