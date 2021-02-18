import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useUILayer } from '../ContextUI'
import { useUserLayer } from '../UserContext'
import { useAuthLogin, useIAuth } from './useIAuth'


export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [{ error, loading }, setStatus] = useState({ error: null, loading: false })
    const { userDispatch } = useUserLayer()

    const {hasPermission} = useIAuth()
    const history = useHistory()


    const handleLogin = (e) => {
        console.log("upa")
        e.preventDefault()
        setStatus(prev => ({ ...prev, loading: true }))
        fetch("http://localhost:8001/api/v1/auth/login", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            method: "POST"
        })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem("token", JSON.stringify(res.token))
                userDispatch({ type: "SET_TOKEN", payload: res.token })
                history.push("/protectedRuta")
                setStatus(prev => ({ ...prev, loading: false }))
                //setPermissionObtained(true)
            })
            .catch(err => {
                //setPermissionObtained(false)
                setStatus(({ error: err.message, loading: false }))
            })
    }
    if (hasPermission) {
        return <Redirect to={{ pathname: "/protectedRuta" }} />
    }
    if (error) {
        return <p>{error}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <form onSubmit={handleLogin}>
            <label>
                <input type="text" name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    required
                />
            </label>
            <label>
                <input type="password" name="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    required
                />
            </label>
            <button type="submit">submita</button>
        </form>
    )
}
