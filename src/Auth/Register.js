import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router'
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
    const [fieldChanging, setFieldChanging] = useState("")
    const { debouncedQuery } = useDebounce({ username, email }, fieldChanging, 800)
    const [validatedFields, setValidatedFields] = useState(
        {
            email: { error: null, valid: null },
            username: { error: null, valid: null }
        }

    )

    const history = useHistory()
    const redirect = history.location.search ? history.location.search.split("=")[1] : ""

    useEffect(() => {
        if (!email) return;

        fetch("http://localhost:8001/api/v1/validation/email", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
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
    }, [debouncedQuery.email])

    useEffect(() => {
        if (!username) return;

        fetch("http://localhost:8001/api/v1/validation/users", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
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
    }, [debouncedQuery.username])

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
                userDispatch({ type: "SET_TOKEN", paylod: res.token })
                userDispatch({ type: "SET_USER", payload: { email } })
                localStorage.setItem("token", JSON.stringify(res.token))
                setSuccess(true)
            })
            .catch(err => { setServerError(err.message) })
    }

    if (success) {
        return <Redirect to={{ pathname: `/${redirect}` }} />
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
                            setFieldChanging("username");
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
                            setFieldChanging("email");
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
        </div>
    )
}
