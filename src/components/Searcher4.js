import { Button, Chip, Divider, List, ListItem, ListItemText, TextField } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import { useDataLayer } from "../Context";
import { Transition } from "react-transition-group";
import { useUILayer } from "../ContextUI";
import { CustomCircularProgress } from "./components/CustomCircularProgress";
import clsx from "clsx";



export const Searcher4 = ({ setSelection }) => {

    const [spinnerReady, setSpinnerReady] = useState(false)

    const { setShowOverlay, setTickerMove } = useUILayer()
    const [{ data, loading, error }, setRequest] = useState({
        data: [],
        loading: false,
        error: "",
    });

    const fetchar = async (query) => {
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


    const [value, setValue] = useState("");
    const [opened, setOpened] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [hasExited, setHasExited] = useState(true)

 
    useEffect(() => {

        if (data.length > 0) {
            setWrapperHeight(listItems.current.offsetHeight)
            setTickerMove(false)
            
        } else {
            if (isSelecting) {
                return
            }
            if (opened) {
                setShowOverlay(false)
                setWrapperHeight(0)
            }
        }
    }, [data])

    useEffect(() => {
        if (value) {
            setShowOverlay(true)
            setOpened(true)
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
        
        setShowOverlay(false)
        setOpened(false);
        setWrapperHeight(0)
        setTickerMove(true)
        setRequest(prev => ({ ...prev, data: [] }))
    }

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

        <div
            style={{ height: getStyles() }}
            className={clsx("searcher4", {
                "open": opened
            })}
            onTransitionEnd={() => { setSpinnerReady(true) }}

        >
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

            />


            <Transition
                in={data.length > 0 && !loading}
                timeout={300}
                onEntered={() => { setHasExited(false) }}
                onExited={() => { setHasExited(true) }}

            >
                {(state) => (
                    <List
                        className="lista-search"
                        style={{ ...defaultStyles, ...transitionStyles[state] }}
                        ref={listItems}
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

            <Transition
                in={loading && hasExited && spinnerReady}
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
};
