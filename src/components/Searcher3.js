import { Button, Chip, List, ListItem, TextField } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDataLayer } from "../Context";
import { Transition } from "react-transition-group";
import { useUILayer } from "../ContextUI";



export const Searcher3 = ({ setSelection }) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

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
    const [upper, setUpper] = useState(0);
    const handleFocus = () => {

    };
    const handleBlur = () => {
        console.log("bluuuur");
        setRequest(prev => ({ ...prev, data: [] }))
    };
    useEffect(() => {
        if (data.length > 0) {
            setOpened(true)
            setTickerMove(false)
            setDimensions(4);
            setUpper(-130);
            setShowOverlay(true)
        } else {
            if (opened) {
                setUpper(0);
                setDimensions(1);
                setShowOverlay(false)
                
                setTickerMove(true)
            }
        }
    }, [data])

    useEffect(() => {
        if (value) {
            fetchar(value)
        }
    }, [value])

    const expandable = useRef(null)
    const listItems = useRef(null)
    const [wrapperHeigh, setWrapperHeight] = useState(340)
    const defaultStyles = {
        opacity: 0,
        transition: "all 0.2s ease"
    }
    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 1 },
        exited: { opacity: 0 },
    }
    console.log(wrapperHeigh, "hiiight")

    return (

        <div className="searcher3"
        style={{height: wrapperHeigh + "px"}}
        // style={listItems.current? {height: listItems.current.offsetHeight} : {height: "40px"}}
        >
            {/* {loading && <p>cargando...</p>}
            {data && data.map((item) => <p>{item.name}</p>)}
            {error && <p>{error}</p>} */}

            <div className="wrapper"

            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    // onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{ transform: `translateY(${upper}px)` }}
                    // style={opened? {top: "0px"} : {top: "initial"}}
                />
                <div
                    className="expandable"
                    style={{ transform: `scaleY(${dimensions})` }}
                    ref={expandable}
                //onTransitionEnd={() => { setWrapperHeight(expandable.current.offsetHeight * 8) }}
                >
                </div>
                <Transition
                    in={data.length > 0 && !loading}
                    mountOnEnter
                    unmountOnExit
                >
                    {(state) => (
                        <List
                            className="lista-search"
                            // style={dimensions > 1 && !loading ? { opacity: 1 } : { opacity: 0 }}
                            style={{ ...defaultStyles, ...transitionStyles[state] }}
                            ref={listItems}
                        >
                            
                            {data.length > 0 && data.map(item =>
                                <ListItem
                                >
                                    {item.name}
                                </ListItem>)}
                        </List>
                    )}
                </Transition>
            </div>


        </div>
    )
    {/* {selection && JSON.stringify(selection, null, 2)} */ }
};
