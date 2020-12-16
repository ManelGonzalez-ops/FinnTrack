import { Paper } from '@material-ui/core'
import React, { useEffect } from 'react'
import { ChartIndex } from './ChartIndex'
import {Constituents} from "./Constituents"

export const BigIndex = ({ index }) => {
    const url = `https://financialmodelingprep.com/api/v3/${index}_constituent?apikey=651d720ba0c42b094186aa9906e307b4`

    const category = index

    const sanitizedQuery = (query) => {
        switch (query) {
            case "sp500":
                return ["^SP500TR","^GSPC"]
            case "nasdaq":
                return ["^NDX","^NDX"]
            case "dowjones":
                return ["^DJI","^DJI"]
            default:
                return false
        }
    }
    const categorySan = sanitizedQuery(index)
    console.log(category, categorySan, "toto")

    return (
        <div className="grid--indexes">
            <Paper
            className="chart"
            >

                <ChartIndex {...{ categorySan, category }} />
            </Paper>

            <Paper
            className="constituents"
            >
                <Constituents className="components" {...{ category, categorySan }}/>
            </Paper>
         
        </div>
    )
}

//tenemos que cambiar la subcategoría a para fechar por primera vez

