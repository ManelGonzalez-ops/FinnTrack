import { CircularProgress, Fade, fade, InputBase, makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { useDebounce, useDebounceCancelable } from "../utils/useDebounce"
import "./navSearch.scss"
import { CustomCircularProgress } from './components/CustomCircularProgress';

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        //width: "100%",

    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit"
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        //transition: theme.transitions.create('width'),
        //width: "100%",
        transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            //width: (props) => props.isFocused ? `calc(100% + 50px)` : "80%",
            width: (props) => props.isFocused ? "250px" : "180px",
        },
    },
    resultsList: {
        position: "absolute",
        left: 0,
        top: "100%",
        width: "100%",
        padding: "1rem",
        listStyle: "none",
        textDecoration: "none",

    },
    menuBody: {
        background: "cornflowerblue",
        position: "absolute",
        width: "100%",
        //height: "1px",
        top: "100%",
        overflow: "hidden",
        height: props => props.isFocused ? props.menuHeight + "px" : "0px",
        //transform: props => props.isFocused ? `scaleY(${props.menuHeight})` : "scaleY(0)",
        transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    }
}));

const handleHeight = (props) => {

}


export const NavSearch = () => {
    const [isFocused, setIsFocused] = useState(false);

    const [inputVal, setInputVal] = useState({ value: "", cancel: false })
    const debouncedField = useDebounceCancelable(inputVal, 300)
    const { data, loading, error } = useSearch(debouncedField)

    const handleInput = (e, newVal) => {
        e.persist()
        console.log(newVal, "targggg")
        console.log(e.target.value, "targggg")
        setInputVal(({ cancel: false, value: e.target.value }))
    }

    const handleBlur = () => {
        setInputVal({ value: "", cancel: true })
        setIsFocused(false);
        setMenuHeight(0)
    }

    const menu = useRef(null)
    const [menuHeight, setMenuHeight] = useState(0)
    useEffect(() => {
        if (menu.current) {
            setMenuHeight(menu.current.getBoundingClientRect().height)
        }
    }, [data, loading])

    const classes = useStyles({ isFocused, menuHeight });

    return (
        <div
            className={classes.search}
        >
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                // onChange={(e) => { setInputVal(prev => ({ ...prev, value: e.target.value })) }}
                onChange={handleInput}
                value={inputVal.value}
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                }}
                //inputProps={{ "aria-label": "search" }}
                onFocus={() => {
                    setIsFocused(true);
                }}
                onBlur={handleBlur}
            //style={{ transformOrigin: "180% 100%" }}
            />

            <div
                className={classes.menuBody}
                style={{ transformOrigin: "top" }}
            >
                <div style={{ position: "relative" }}>
                    <Fade
                        in={!!data || loading}
                        timeout={300}
                        mountOnEnter
                        unmountOnExit
                    >
                        <ul
                            ref={menu}
                            className={classes.resultsList}

                        > {loading ? <CircularProgress style={{ display: "block" }} />
                            : data && data.map(stock => {
                                return <LiItem key={stock.name}
                                    info={stock}
                                />
                            })}
                        </ul>
                    </Fade>
                </div>
            </div>
        </div>
    )
}

const LiItem = ({ info }) => {

    return (
        <li className="list-item-search">
            {info.name}
        </li>
    )
}

const useSearch = (query) => {
    const [{ data, loading, error }, setRequest] = useState({ data: "", loading: false, error: null })
    const fetchar = async (query) => {
        console.log("quuuuery")
        if (!query) {
            setRequest({ loading: false, data: "" })
            return
        }

        try {
            setRequest((prev) => ({ ...prev, loading: true }));
            const rawData = await fetch(`http://localhost:8001/api/v1/recurringTasks/search/${query}`);
            const { data } = await rawData.json();
            const dataOnlyStocks = data.filter(item => item.assetType === "Stock")
            setRequest((prev) => ({ ...prev, data: dataOnlyStocks, loading: false }));
        } catch (err) {
            setRequest((prev) => ({
                ...prev,
                loading: false,
                error: err.message,
            }));
        }
    };

    useEffect(() => {
        fetchar(query)
    }, [query])

    return { data, loading, error }
}