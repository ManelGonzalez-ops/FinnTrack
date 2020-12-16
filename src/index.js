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

 //hasrouter won't work with okta
ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <UIProvider>
        <BrowserRouter>
            <AppWithRouterAccess />
        </BrowserRouter>
      </UIProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

{/*</Security> */ }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
