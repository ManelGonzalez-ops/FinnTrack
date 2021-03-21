import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./styles/main.css"
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from "react-router-dom";
import { ContextProvider } from './Context';
import { UIProvider } from './ContextUI';
import { AppWithRouterAccess } from './AppWithRouterAccess';
import { UserContext } from './UserContext';

//hasrouter won't work with okta
ReactDOM.render(
  <React.StrictMode>
    <UserContext>
      <ContextProvider>
        <UIProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UIProvider>
      </ContextProvider>
    </UserContext>
  </React.StrictMode>,
  document.getElementById('root')
);

{/*</Security> */ }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
