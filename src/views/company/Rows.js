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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { formatter } from "../../utils/numFormatter";

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
    tableConatiner: {

    },

    iconButton: {
        padding: 0
    },

    cell: {
        borderBottom: "none"
    },
    sectionTitleCell: {
        [theme.breakpoints.up("md")]: {
            // paddingLeft: 0, paddingRight: 0
        },
        [theme.breakpoints.up("lg")]: {

            // paddingLeft: 0, paddingRight: "35px"
        }
    },
    subtitles: {
        [theme.breakpoints.up("md")]: {
            // maxWidth: "130px"
        },
        [theme.breakpoints.up("lg")]: {
            // maxWidth: "none",
            // width: "200px"
        },
        // maxWidth: "none"
    }
}))


const TableCellSmall = withStyles({
    root: {
        transform: "translateX(1.5rem)",
        // whiteSpace: "nowrap"
    }
})(TableCell)
const TableCellXSmall = withStyles({
    root: {
        transform: "translateX(3rem)",
        // whiteSpace: "nowrap"
    }
})(TableCell)

const makeShortInt = (item) => formatter.format(parseInt(item) / 1000000).replace(".00", "")
export const TableSectionChunk = ({ title, data, lookupKey, open, setOpen }) => {
    const classes = useStyles()
    console.log(data, "la datona")
    return (
        <TableRow
        >
            <TableCell
            style={{padding: "0.5rem", width: "40px", textAlign: "center"}}
            >
                <IconButton
                    classes={{ root: classes.iconButton }}
                    onClick={() => { setOpen(prev => !prev) }}
                >
                    {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
            </TableCell>
            <TableCell
                classes={{ root: classes.sectionTitleCell }}
                colSpan={2}
                >
                <p
                //style={{width: "120px"}}
                
                >{title}</p></TableCell>
            {data && Object.keys(data[lookupKey]).map(date =>
                <TableCell
                    align="right"
                >
                    {makeShortInt(data[lookupKey][date])}</TableCell>)
            }
        </TableRow>
    )
}
export const TableSubtitleChunk = ({ title, data, lookupKey, hackWidth }) => {
    const classes = useStyles()
    return (
        <TableRow
        >
            <TableCell
                classes={{ root: classes.cell }}
                style={{padding: "0.5rem", width: "40px", textAlign: "center"}}
            >
                <IconButton
                    classes={{ root: classes.iconButton }}
                    style={{ visibility: "hidden" }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
            </TableCell>
            <TableCellSmall
                classes={{ root: classes.cell }}
                colSpan={2}>
                <p
                    className={classes.subtitles}
                >{title}</p>
            </TableCellSmall>
            {data && Object.keys(data[lookupKey]).map(date =>
                <TableCell
                    align="right"
                    style={{ width: hackWidth + "px" }}
                    classes={{ root: classes.cell }}
                >{makeShortInt(data[lookupKey][date])}</TableCell>)
            }
        </TableRow>
    )
}
export const TableSubSubtitleChunk = ({ title, data, lookupKey, hackWidth }) => {
    const classes = useStyles()
    return (
        <TableRow
        >
            <TableCell
                classes={{ root: classes.cell }}
                
            >
                <IconButton
                    classes={{ root: classes.iconButton }}
                    style={{ visibility: "hidden" }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
            </TableCell>
            <TableCellXSmall
                classes={{ root: classes.cell }}

                colSpan={2}>
                <p
                    className={classes.subtitles}
                >{title}</p>
            </TableCellXSmall>
            {data && Object.keys(data[lookupKey]).map(date =>
                <TableCell
                    align="right"
                    classes={{ root: classes.cell }}
                    style={{ width: hackWidth + "px" }}
                >{makeShortInt(data[lookupKey][date])}</TableCell>)
            }
        </TableRow>
    )
}

export const Collapsible = ({ children, renderTitleSection }) => {
    const [open, setOpen] = useState(false)
    return (
        <TableBody>
            {renderTitleSection(open, setOpen)}
            <TableRow
            //  style={{...defaultStyles, ...transitionStyles[state]}}
            >
                <TableCell colSpan={8} className="nested-cell">
                    <Collapse
                        in={open}
                        mountOnEnter
                        timeout="auto"
                        unmountOnExit
                    >
                        <Table >
                            <TableBody>
                                {children}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </TableBody>
    )
}

export const TableSectionAlone = ({ title, data, lookupKey }) => {
    const classes = useStyles()
    return (
        <TableRow
        >
            <TableCell>
                <IconButton
                    classes={{ root: classes.iconButton }}
                    style={{ visibility: "hidden" }}
                >
                    {<KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell
                classes={{ root: classes.sectionTitleCell }}
                colSpan={2}
               >
                <p
                //style={{width: "120px"}}
                >{title}</p></TableCell>
            {data && Object.keys(data[lookupKey]).map(date =>
                <TableCell
                    align="right"
                >
                    {makeShortInt(data[lookupKey][date])}</TableCell>)
            }
        </TableRow>
    )
}