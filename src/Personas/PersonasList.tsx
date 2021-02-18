import React, { useEffect, useReducer } from 'react'
import { UserMain } from '../dashboard/UserMain'
import { PeopleItem } from './interfaces'
import { UserItem } from './UserItem'

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

    const [state, dispatch] = useReducer(reducer, { data: null, loading: false, error: "" })

    const { data, loading, error } = state
    const getPeople = () => {
        return fetch("http://localhost:8001/api/v1/people/main")
            .then(res => res.json())
            .then(res => {
                return res.map((item: any) => {
                    const { portfolio } = item
                    const parsedPortfolio = JSON.parse(portfolio)
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
        justifyContent: "space-around",
        flexWrap: "wrap"
    }

    useEffect(() => {
        getPeople()
    }, [])
    return (
        <div style={divStilos}>
            {loading ? <p>Loading ...</p>
                : error ? <p>{error}</p>
                    : data && data.map((person) => {
                        return <UserItem {...{ person }} />
                    })}
        </div>
    )
}


//const UserItem =()=>null