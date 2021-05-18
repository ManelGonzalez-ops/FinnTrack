import {
    Collapse,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    withStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useCellWidth } from "../../../utils/useCellWidth";
import { Collapsible, TableSectionAlone, TableSectionChunk, TableSubSubtitleChunk, TableSubtitleChunk } from "../Rows";

const useStyles = makeStyles((theme) => ({

    root: {
        background: "white",
        borderRadius: "10px",
        margin: "0 auto",
        width: "750px",

        [theme.breakpoints.up("lg")]: {
            width: "1000px"
        },
        [theme.breakpoints.up("xl")]: {
            width: "1250px"
        }
    }
}))
const cellWidthBreakpoints = {
    small: {
        cellSize: 110,
    },
    medium: {
        breakpoint: 1280,
        cellSize: 135,
    },
    large: {
        breakpoint: 1900,
        cellSize: 170
    }
}
export const CashFlow = ({ anualdata, readyData }) => {

    //lg const cellWidth = 175
    const { cellWidth, breakpoint } = useCellWidth(cellWidthBreakpoints)
    //we need to loop each field, which is an object with the  values of 5 different years
    const classes = useStyles()
    return (
        <TableContainer
        >
            <Table
                classes={{
                    root: classes.root,
                }}
                className={breakpoint === "small" && "financials-table--small"}
            >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3} />
                        {anualdata.current &&
                            Object.keys(anualdata.current).map((year) => (
                                <TableCell
                                    align="right"
                                >{year}</TableCell>
                            ))}
                    </TableRow>
                </TableHead>
                {/* <TableSectionAlone
                    title="Total Common Shares Outstanding" lookupKey="commonStockSharesOutstanding"
                    data={readyData}
                /> */}

                <Collapsible fieldName="assets"
                    renderTitleSection={
                        (injectedOpen, setInjectedOpen) => <TableSectionChunk
                            open={injectedOpen}
                            setOpen={setInjectedOpen}
                            title="Cash from Operating Activities"
                            data={readyData}
                            lookupKey="operatingCashflow"
                        />
                    }>

                    <TableSubtitleChunk hackWidth={cellWidth} title="depreciation" lookupKey="depreciation" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Change in Receivables" lookupKey="changeInReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="change in Account Receivables" lookupKey="changeInAccountReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="change in Inventory" lookupKey="changeInInventory" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="other Operating Cash Flow" lookupKey="otherOperatingCashflow" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Investments" lookupKey="investments" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="change in Liabilities" lookupKey="changeInLiabilities" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Net Borrowings" lookupKey="netBorrowings" data={readyData} />

                </Collapsible>
                <Collapsible fieldName="assets"
                    renderTitleSection={
                        (injectedOpen, setInjectedOpen) => <TableSectionChunk
                            open={injectedOpen}
                            setOpen={setInjectedOpen}
                            title="Cash from Investing Activities"
                            data={readyData}
                            lookupKey="cashflowFromInvestment"
                        />
                    }>

                    <TableSubtitleChunk hackWidth={cellWidth} title="Capital Expenditures" lookupKey="capitalExpenditures" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="other Cash Flow from Investing" lookupKey="otherCashflowFromInvestment" data={readyData} />

                </Collapsible>
                <Collapsible fieldName="assets"
                    renderTitleSection={
                        (injectedOpen, setInjectedOpen) => <TableSectionChunk
                            open={injectedOpen}
                            setOpen={setInjectedOpen}
                            title="Cash from Financing Activities"
                            data={readyData}
                            lookupKey="cashflowFromFinancing"
                        />
                    }>

                    <TableSubtitleChunk hackWidth={cellWidth} title="other Cash and Short Term Investments" lookupKey="otherCashflowFromFinancing" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="change In exchange Rate" lookupKey="changeInExchangeRate" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="dividend Payout" lookupKey="dividendPayout" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Stock Sale and Purchase" lookupKey="stockSaleAndPurchase" data={readyData} />

                </Collapsible>


            </Table>
        </TableContainer>
    );
};