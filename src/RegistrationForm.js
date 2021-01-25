import React, { useState } from 'react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import FacebookLogin from 'react-facebook-login';
import {useHistory} from "react-router-dom"
const RegisterForm = () => {
    const { authService } = useOktaAuth();
    const [sessionToken, setSessionToken] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch("http://localhost:8001/api/users", {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ firstName, lastName, password, email, sessionToken: null })
        }).then(res => {
            console.log(res, "guuuuuu")
            const oktaAuth = new OktaAuth({
                // If your app is configured to use the Implicit Flow
                // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
                // you will need to uncomment the below line:
                // pkce: false,
                issuer: `${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`
            });
            oktaAuth.signIn({
                username: email
                , password
            })
                .then(res => {
                    console.log(res, "ki pasa")
                    const sessionToken = res.sessionToken;
                    setSessionToken(sessionToken);
                    // sessionToken is a one-use token, so make sure this is only called once
                    authService.redirect({ sessionToken });
                })
                .catch(err => console.log('Found an error', err));
        }).catch(err => { console.log(err, "kuuu") })


    };


    if (sessionToken) {
        // Hide form while sessionToken is converted into id/access tokens
        return null;
    }

    return (
        <>
            <FacebookLogin
                appId="121304306392446"
                autoLoad={true}
                fields="name,email,picture"
                onClick={()=>{history.push(	"https://dev-5378874.okta.com/oauth2/v1/authorize/callback")}}
                //callback={responseFacebook} 
                />
            <form onSubmit={handleSubmit}>
                <label>
                    FirstName:
        <input
                        id="firstName" type="text"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value) }} />
                </label>
                <label>
                    LastName:
        <input
                        id="LastName" type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value) }} />
                </label>
                <label>
                    email:
        <input
                        id="email" type="text"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }} />
                </label>
                <label>
                    Password:
        <input
                        id="password" type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <input id="submit" type="submit" value="Submit" />
            </form>
        </>
    );
};
export default RegisterForm;