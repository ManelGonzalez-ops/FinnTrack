import { Button, Dialog, DialogContent, makeStyles, Slide, TextField, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { useUILayer } from '../ContextUI'
import { useUserLayer } from '../UserContext'
import { FacebookButton } from './SocialButtons'
import { useIAuth } from './useIAuth'

const useStyles = makeStyles({
    formField: {
        marginBottom: "10px"
    }
})
export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [{ error, loading }, setStatus] = useState({ error: null, loading: false })
    const { userDispatch, userState: { token } } = useUserLayer()
    const [emailValid, setEmailValid] = useState(true)
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        const isValid = isValidEmail(e.target.value)
        isValid ? setEmailValid(true) : setEmailValid(false)
    }
    const isValidEmail = (text) => /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(new RegExp(text))
    const history = useHistory()
    const location = useLocation()

    const redirect = history.location.search ? history.location.search.split("=")[1] : ""

    const theme = useTheme()
    const isSmallViewport = useMediaQuery(theme.breakpoints.down("sm"))

    const handleLogin = (e) => {
        console.log("upa")
        e.preventDefault()
        setStatus(prev => ({ ...prev, loading: true }))
        fetch(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
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

    const styles = useStyles()

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
        <Dialog
            open={true}
            TransitionComponent={Transition}
            onClose={() => { history.goBack() }}
        >
            <div
                className="form"
            >
                <h1
                    className="form__title"
                >Sign in</h1>

                <div className="formLocal">
                    <form onSubmit={handleLogin}>
                        <TextField
                            size={isSmallViewport ? "small" : "large"}
                            type="email"
                            name="email"
                            value={email}
                            label="email"
                            onChange={(e) => {
                                handleEmailChange(e)
                            }}
                            error={!emailValid}
                            helperText={!emailValid && "email not valid"}
                            required
                            classes={{ root: styles.formField }}
                        />
                        <TextField
                            size={isSmallViewport ? "small" : "large"}
                            type="password" name="password"
                            value={password}
                            label="password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            required
                            classes={{ root: styles.formField }}
                        />

                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!emailValid}
                        >Continue</Button>
                        <div
                            className="form__footer"
                        >
                            <p>Need to sign up?</p>
                            <Button
                                onClick={() => {
                                    history.push(redirect ? `/register?redirect=${redirect}` : "/register", { background: location })
                                }}
                                variant="outlined"
                                color="primary"
                            >
                                Signup
                        </Button>

                        </div>
                    </form>
                </div>
                <h5 className="form__or">
                    - OR -
            </h5>
                <div
                    className="formOauth"
                >
                    <FacebookButton
                        href={`${process.env.REACT_APP_API}/api/v1/auth/oauth/facebook`}
                    />
                    <FacebookButton
                        href={`${process.env.REACT_APP_API}/api/v1/auth/oauth/google`}
                    />

                </div>
            </div>
        </Dialog>
    )
}

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});