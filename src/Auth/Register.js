import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useUserLayer } from '../UserContext'
import { useDebounce } from '../utils/useDebounce'

export const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rpassword, setRpassword] = useState("")
    const { userDispatch } = useUserLayer()
    const [serverError, setServerError] = useState(null)
    const [success, setSuccess] = useState(false)
    const debouncedUsername = useDebounce(username, 800)
    const debouncedEmail = useDebounce(email, 800)
    const [validatedFields, setValidatedFields] = useState(
        {
            email: { error: null, valid: null },
            username: { error: null, valid: null }
        }

    )

    const history = useHistory()
    console.log(history, "historyya")
    const redirect = history.location.search ? history.location.search.split("=")[1] : ""

    
    useEffect(() => {
        if (!debouncedUsername) return;
        
        fetch("http://localhost:8001/api/v1/validation/users", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: debouncedUsername}),
            method: "POST"
        })
            .then(res => res.json().then(data => {
                if (!res.ok) throw new Error(data.msg);
                setValidatedFields(prev => ({
                    ...prev,
                    username: { error: null, valid: true }
                }))
            }))
            .catch(err => {
                console.log(err, "error")
                setValidatedFields(prev => ({
                    ...prev,
                    username: { valid: null, error: err.message }
                }))
            })
        }, [debouncedUsername])
        
        useEffect(() => {
            if (!debouncedEmail) return;
    
            fetch("http://localhost:8001/api/v1/validation/email", {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: debouncedEmail }),
                method: "POST"
            })
                .then(res => res.json().then(data => {
                    if (!res.ok) throw new Error(data.msg);
                    setValidatedFields(prev => ({
                        ...prev,
                        email: { error: null, valid: true }
                    }))
                }))
                .catch(err => {
                    console.log(err, "error")
                    setValidatedFields(prev => ({
                        ...prev,
                        email: { valid: null, error: err.message }
                    }))
                })
        }, [debouncedEmail])
        
        const handleSubmit = (e) => {
            e.preventDefault()
            if (rpassword !== password) {
                alert("password don't match")
                return
            }
            handleRegister()
    }
    const handleRegister = () => {
        fetch("http://localhost:8001/api/v1/auth/register", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            method: "POST"
        })
            .then(res => {
                if (!res.ok) throw new Error("what the hell");
                return res
            })
            .then(res => res.json())
            .then(res => {
                console.log(res.token, "setting token")
                userDispatch({ type: "SET_TOKEN", payload: res.token })
                userDispatch({ type: "SET_USER", payload: { email } })
                localStorage.setItem("token", JSON.stringify(res.token))
                history.push("/")
                setSuccess(true)
            })
            .catch(err => { setServerError(err.message) })
    }
    if (success) {
        //this is not working properly
        return <Redirect to={`/${redirect}`} />
    }
    if (serverError) {
        return <p>{serverError}</p>
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label for="username">
                    username
                    <input type="text" value={username}
                        name="username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        required
                    />
                </label>
                {validatedFields.username.error && <p>{validatedFields.username.error}</p>}
                {validatedFields.username.valid && <p>valid username</p>}
                <label for="email">
                    email
                    <input type="email" value={email}
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        required
                    />
                </label>
                {validatedFields.email.error && <p>{validatedFields.email.error}</p>}
                {validatedFields.email.valid && <p>valid email</p>}
                <label for="password">
                    password
                    <input type="password" value={password}
                        name="password"
                        onChange={(e) => { setPassword(e.target.value) }}
                        required />
                </label>
                <label for="rpassword">
                    repeat password
                    <input type="password" value={rpassword}
                        name="rpassword"
                        onChange={(e) => { setRpassword(e.target.value) }}
                        required />
                </label>
                <Button
                    disabled={!validatedFields.username.valid || !validatedFields.email.valid}
                    type="submit">submit</Button>
            </form>
            <div>
                <h3>Social Login</h3>
                <a href="http://localhost:8001/api/v1/auth/oauth/facebook" >Facebook</a>
            </div>
        </div>
    )
}
