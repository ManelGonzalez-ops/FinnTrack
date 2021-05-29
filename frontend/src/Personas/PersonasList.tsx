import { LinearProgress } from '@material-ui/core'
import React, {useEffect, useReducer, useState} from 'react'
import { PeopleItem } from './interfaces'
import { UserItem } from './UserItem.js'

interface userMain {
    data: PeopleItem[] | null
    loading: boolean
    error: string
}
type State = { type: "fetching", payload: boolean }
    | { type: "success", payload: PeopleItem[] }
    | { type: "error", payload: string }

const reducer = (state: userMain, action: State) => {
    switch (action.type) {
        case "fetching":
            return {
                ...state,
                loading: true
            }
        case "success":
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case "error":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const PersonasList = () => {

    const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: "" })
    const [currentPage, setCurrentPage] = useState(1)
    const [resultsXPage, setResultsXPage] = useState(10)
    const [order, setOrder] = useState("no order")
    const { data, loading, error } = state
    const getPeople = () => {
        return fetch(`${process.env.REACT_APP_API}/api/v1/people/send`)
            .then(res => res.json())
            .then(res => {
                return res.map((item: any) => {
                    const { portfolio } = item
                    let parsedPortfolio = portfolio
                    if (typeof portfolio === "string") {
                        parsedPortfolio = JSON.parse(portfolio)
                    }
                    return { ...item, portfolio: parsedPortfolio }
                })
            })
            .then(res => { dispatch({ type: "success", payload: res }) })
            .catch(err => { dispatch({ type: "error", payload: err.message }) })
    }
    useEffect(() => {
        console.log(data, "doooto")
    }, [data])
    const divStilos: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",

    }

    useEffect(() => {
        getPeople()
    }, [])
    return (
        <div style={divStilos}>
            {loading ? <LinearProgress />
                : error ? <p>{error}</p>
                    : data && data.map((person) => {
                        return <UserItem key={person.user.username} {...{ person }} />
                    })}
        </div>
    )
}


//const UserItem =()=>null