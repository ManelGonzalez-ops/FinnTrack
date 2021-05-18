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

    const { path } = useRouteMatch()
    useMountApproval()
    
    

    return (
        <Switch>
            <Route path={`${path}/overview/:company`} exact>
                <CompanySection />
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
