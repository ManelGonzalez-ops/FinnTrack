import { Button, Chip, Divider, List, ListItem, ListItemText, TextField } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDataLayer } from "../Context";
import { Transition } from "react-transition-group";
import { useUILayer } from "../ContextUI";
import { CustomCircularProgress } from "./components/CustomCircularProgress";
import clsx from "clsx";
import { SettingsSystemDaydreamTwoTone } from "@material-ui/icons";


export const Searcher4 = ({ setSelection }) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [spinnerReady, setSpinnerReady] = useState(false)

    const { setShowOverlay, setTickerMove } = useUILayer()
    const [{ data, loading, error }, setRequest] = useState({
        data: [],
        loading: false,
        error: "",
    });

    const { state, dispatch } = useDataLayer()
    const fetchar = async (query) => {
        try {
            setRequest((prev) => ({ ...prev, loading: true }));
            const rawData = await fetch(`http://localhost:8001/search/${query}`);
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


    const handleSelection = (value, reason) => {
        if (reason === "select-option") {
            console.log(value, "valueeee")
            setSelection(value);
        }
    };





    const [value, setValue] = useState("");
    const [opened, setOpened] = useState(false)
    const [dimensions, setDimensions] = useState(1);
    const [isSelecting, setIsSelecting] = useState(false)
    const [upper, setUpper] = useState(0);
    const [hasExited, setHasExited] = useState(true)

    const handleBlur = () => {
        console.log("bluuuur");
        setRequest(prev => ({ ...prev, data: [] }))
    };
    useEffect(() => {

        if (data.length > 0) {
            setWrapperHeight(listItems.current.offsetHeight)
            setOpened(true)
            setTickerMove(false)
            setDimensions(4);
            setUpper(-40);
            setShowOverlay(true)
        } else {
            if (isSelecting) {
                return
            }
            if (opened) {
                setUpper(0);
                setDimensions(1);
                setShowOverlay(false)
                setWrapperHeight(0)
                //setTickerMove(true)
            }
        }
    }, [data])

    useEffect(() => {
        if (value) {
            fetchar(value)
        }
    }, [value])

    const listItems = useRef(null)
    const [wrapperHeigh, setWrapperHeight] = useState(0)
    const defaultStyles = {
        opacity: 0,
        transition: "all 0.25s ease"
    }
    const transitionStyles = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
    }
    console.log(wrapperHeigh, "hiiight")
    const cleanUp = () => {
        console.log("bblurrring ejecutao")
        setOpened(false);
        setDimensions(1);
        setShowOverlay(false)
        setWrapperHeight(0)
        setTickerMove(true)
        setRequest(prev => ({ ...prev, data: [] }))
    }
    // const handleClose = () => {
    //     if (!data.length) {
    //         setTickerMove(true)
    //     }
    // }

    const getStyles = () => {
        //in initial animation spinner waits for search to be expanded  
        if (loading && data.length === 0) {
            //setSpinnerReady(false)
            return "150px"
        }
        return wrapperHeigh > 0 ? wrapperHeigh + 40 + "px" : "50px"
    }

    useEffect(() => {
        console.log(isSelecting, "selec")
    })

    return (

        //we n
        <div
            style={{ height: getStyles() }}
            // style={{ height: wrapperHeigh + 40 + "px" }}
            className={clsx("searcher4", {
                "open": opened
            })}
            onTransitionEnd={() => { setSpinnerReady(true) }}
        // style={listItems.current? {height: listItems.current.offsetHeight} : {height: "40px"}}
        >
            {/* {loading && <p>cargando...</p>}
            {data && data.map((item) => <p>{item.name}</p>)}
            {error && <p>{error}</p>} */}


            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                onBlur={(e) => {
                    console.log("bblurrring")
                    setSpinnerReady(false)
                    !isSelecting && cleanUp()
                }}
            // style={{ transform: `translateY(${upper}px)` }}

            />


            <Transition
                in={data.length > 0 && !loading}
                timeout={300}
                // mountOnEnter
                // unmountOnExit
                onEntered={() => { setHasExited(false) }}
                onExited={() => { setHasExited(true) }}

            >
                {(state) => (
                    <List

                        className="lista-search"
                        // style={dimensions > 1 && !loading ? { opacity: 1 } : { opacity: 0 }}
                        style={{ ...defaultStyles, ...transitionStyles[state] }}
                        ref={listItems}
                    //onClick={(e)=>{console.log("hellowww")}}
                    >

                        {data.length > 0 && data.map((item, index) =>
                            <>
                                { index > 0 && <Divider />}
                                <ListItemText
                                    key={item.ticker}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        console.log("estas clickando")
                                        setShowOverlay(false)
                                        setSelection(item)
                                    }}
                                    onMouseOver={() => { setIsSelecting(true) }}
                                    onMouseOut={() => { setIsSelecting(false) }}
                                >
                                    {item.name}
                                </ListItemText>
                            </>)}
                    </List>
                )}
            </Transition>

            {/* {loading && <CustomCircularProgress
                adaptable={true} />} */}
            <Transition
                in={loading && hasExited && spinnerReady}
                // timeout={{
                //     appear: 1000,
                //     enter: 1000,
                //     exit: 300,
                // }}
                mountOnEnter
                unmountOnExit
            >
                {state => (
                    <CustomCircularProgress
                        adaptable={true}
                        animState={state} />
                )}
            </Transition>

        </div>
    )
    {/* {selection && JSON.stringify(selection, null, 2)} */ }
};
