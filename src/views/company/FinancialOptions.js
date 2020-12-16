import { Button } from '@material-ui/core'
import React from 'react'

export const FinancialOptions = ({ handleGetIncome }) => {
    return (
        <nav
            className="navigation-right"
        >
            <ul>

                <li>
                    <Button
                        variant="contained"
                        onClick={() => { handleGetIncome("BALANCE_SHEET") }}
                    >
                        Balance
                            </Button>
                </li>
                <li>
                    <Button
                        variant="contained"
                        onClick={() => { handleGetIncome("INCOME_STATEMENT") }}

                    >
                        Resultados
                            </Button>
                </li>
                <li>
                    <Button
                        variant="contained"
                        onClick={() => { handleGetIncome("CASH_FLOW") }}
                    >
                        Cash Flows
                            </Button>
                </li>

            </ul>
        </nav>
    )
}


{/* <div
    className="grid-financial-menu"
>
    <div style={{ background: "#403f4c" }}>

    </div>
    <div style={{ background: "#e84855" }}>

    </div>
    <div style={{ background: "#F9DC5C" }}>

    </div>
</div> */}