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
import { Collapsible, TableSectionAlone, TableSectionChunk, TableSubSubtitleChunk, TableSubtitleChunk } from "../Rows";

const useStyles = makeStyles((theme) => ({

    root: {
        background: "white",
        borderRadius: "10px",
        margin: "0 auto",
        width: "100%",
        // [theme.breakpoints.up("sm")]: {
        //     width: "700px"
        // },
        [theme.breakpoints.up("md")]: {
            width: "1000px"
        },
        [theme.breakpoints.up("lg")]: {
            width: "1250px"
        }
    },
    // tableConatiner: {

    // },

    // iconButton: {
    //     padding: 0
    // },

    // cell: {
    //     borderBottom: "none"
    // },
    // sectionTitleCell: {
    //     [theme.breakpoints.up("md")]: {
    //         paddingLeft: 0, paddingRight: 0
    //     },
    //     [theme.breakpoints.up("lg")]: {

    //         paddingLeft: 0, paddingRight: "35px"
    //     }
    // },
    // subtitles: {
    //     // [theme.breakpoints.up("md")]: {
    //     //     maxWidth: "130px"
    //     // },
    //     // [theme.breakpoints.up("lg")]: {
    //     //     maxWidth: "none",
    //     //     width: "200px"
    //     // },
    //     // maxWidth: "none"
    // }
}))

export const CashFlow = ({ anualdata, readyData }) => {

    //lg const nestedHackWidth = 175
    const nestedHackWidth = 138
    //we need to loop each field, which is an object with the  values of 5 different years
    const classes = useStyles()
    return (
        <TableContainer
            classes={{
                root: classes.root,
            }}
        >
            <Table >
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

                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="depreciation" lookupKey="depreciation" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Change in Receivables" lookupKey="changeInReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="change in Account Receivables" lookupKey="changeInAccountReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="change in Inventory" lookupKey="changeInInventory" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="other Operating Cash Flow" lookupKey="otherOperatingCashflow" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Investments" lookupKey="investments" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="change in Liabilities" lookupKey="changeInLiabilities" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Net Borrowings" lookupKey="netBorrowings" data={readyData} />

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

                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Capital Expenditures" lookupKey="capitalExpenditures" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="other Cash Flow from Investing" lookupKey="otherCashflowFromInvestment" data={readyData} />

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

                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="other Cash and Short Term Investments" lookupKey="otherCashflowFromFinancing" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="change In exchange Rate" lookupKey="changeInExchangeRate" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="dividend Payout" lookupKey="dividendPayout" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Stock Sale and Purchase" lookupKey="stockSaleAndPurchase" data={readyData} />

                </Collapsible>


            </Table>
        </TableContainer>
    );
};