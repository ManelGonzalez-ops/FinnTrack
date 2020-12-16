import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback} from '@okta/okta-react';
import SignIn from './SignIn';
import App from "./App"
import RegistrationForm from "./RegistrationForm"

export const AppWithRouterAccess = () => {
    const history = useHistory();
    const onAuthRequired = () => {
        history.push('/login');
    };

    return (
        <Security
            issuer={`${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`}
            clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
            redirectUri={`${window.location.origin}/login/callback`}
            onAuthRequired={onAuthRequired}
            pkce={true} >
            <Route path='/' component={App} />
            <SecureRoute path='/protected' component={Protected} />
            <Route path='/login' render={() => <SignIn issuer={`${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`} />} />
            <Route path="/register" component={RegistrationForm} />
            <Route path='/login/callback' component={LoginCallback} />
        </Security>
    );
};

const Protected = () => <div>This route is Protected </div>