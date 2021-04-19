import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useUILayer } from '../ContextUI'
import { useUserLayer } from '../UserContext'
import { useIAuth } from './useIAuth'


export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [{ error, loading }, setStatus] = useState({ error: null, loading: false })
    const { userDispatch, userState: { token } } = useUserLayer()

    const history = useHistory()

    const redirect = history.location.search ? history.location.search.split("=")[1] : ""

    const handleLogin = (e) => {
        console.log("upa")
        e.preventDefault()
        setStatus(prev => ({ ...prev, loading: true }))
        fetch("http://localhost:8001/api/v1/auth/login", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            method: "POST"
        })
            .then(res => {
                if (!res.ok) throw new Error("error in passport middleware");
                return res
            })
            .then(res => res.json())
            .then(res => {
                console.log(res, "reases")
                localStorage.setItem("token", JSON.stringify(res.token))
                userDispatch({ type: "SET_USER_AND_TOKEN", payload: { email, token: res.token } })
                setStatus(prev => ({ ...prev, loading: false }))
                //setPermissionObtained(true)
            })
            .catch(err => {
                //setPermissionObtained(false)
                setStatus(({ error: err.message, loading: false }))
            })
    }


    console.log(token, "infotoken")
    if (token) {
        return <Redirect to={{ pathname: `/${redirect}` }} />
    }
    if (error) {
        return <p>{error}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>
                    <input type="text" name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        required
                    />
                </label>
                <label>
                    <input type="password" name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        required
                    />
                </label>
                <button type="submit">submita</button>
            </form>
            <div>
                <p>Need to sign up?</p>
                <Button onClick={() => {
                    history.push(redirect ? `/register?redirect=${redirect}` : "/register")
                }}>Signup</Button>
            </div>
        </div>
    )
}
