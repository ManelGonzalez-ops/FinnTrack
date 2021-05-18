import React, { useState, useEffect } from 'react'
import { IndexesChart2 } from './indexesChart2'
import { MiniatureChart } from './MiniatureChartIndex'
import { TransitionComponent } from "../components/TransitionComponent"
export const GeneralIndexDispatcher = ({ datos, setChartSelected, chartSelected }) => {
    const [openChartModal, setOpenChartModal] = useState(false)

    useEffect(() => {
        if (chartSelected === datos.symbol) {
            setOpenChartModal(true)
            console.log(datos.symbol, "siimbol")
        } else {
            setOpenChartModal(false)
        }
    }, [chartSelected])

    return (
        <div
            onClick={() => { setChartSelected(datos.symbol) }}
        >
            {
                openChartModal ?
                    <TransitionComponent
                    open={openChartModal}
                    setOpenChartModal={setOpenChartModal}
                    >
                        <IndexesChart2
                            datos={datos}
                        />
                    </TransitionComponent>
                    :

                    <MiniatureChart datos={datos} />

            }

        </div>
    )
}
