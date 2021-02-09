import React from 'react'
import {Route, useRouteMatch} from "react-router-dom"
import { PeopleDetails } from './PeopleDetails'
import { PersonasList } from './PersonasList'
export const PeopleRouter = () => {
    const {path} = useRouteMatch()
    return (
        <>
        <Route path={path} exact>
            <PersonasList/>
        </Route>
        <Route path={`${path}/:id`}>
            <PeopleDetails/>
        </Route>
        </>
    )
}
