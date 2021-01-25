import React, { useRef, useEffect } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { KeymetricsChart } from '../../charts/KeymetricsChart';
import { useUILayer } from '../../ContextUI';
import { useMountApproval } from '../../utils/useMountApproval';
import { CovidSection2 } from '../covid/CovidSection2';
import { News } from '../principal/elements/News';
import { CompanySection } from './CompanySection';
import { Financials } from './Financials';


export const ControllerCompany = () => {
    const history = useHistory()
    const { path } = useRouteMatch()
    useMountApproval()
    const chart = useRef(null);
    const { sidebarOpen } = useUILayer()
    const initial = useRef(true)
    useEffect(() => {
        console.log(chart, "puta")
        console.log(chart.current, "puta2")
        if (chart.current && Object.keys(chart.current).length > 0 && !initial.current) {
            setTimeout(() => {
                chart.current.reflow()
            }, 200)
        }
        initial.current = false
    }, [sidebarOpen, history])

    return (
        <Switch>
            <Route path={`${path}/overview/:company`} exact>
                <CompanySection ref={chart} />
            </Route>
            <Route path={`${path}/keymetrics/:company`} exact>
                <KeymetricsChart />
            </Route>
            <Route path={`${path}/financials/:company`} exact>
                <Financials />
            </Route>
        </Switch>
    )
}
