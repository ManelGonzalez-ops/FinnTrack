import { Button, Dialog, FilledInput, FormControl, FormHelperText, Grow, IconButton, Input, InputAdornment, InputLabel, makeStyles, Slide, TextField, useMediaQuery, useTheme, withStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useUserLayer } from '../UserContext'
import { useDebounce } from '../utils/useDebounce'
import { FacebookButton } from './SocialButtons'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    formField: {
        marginBottom: "10px"
    },
    helperText: {
        color: "red"
    },
    textField: {
        width: "100%"
    },
    dialog: {
        [theme.breakpoints.down("sm")]: {
            maxWidth: "none"
        }
    }
}))
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
            username: { error: null, valid: null },
            password: { error: null, valid: null }
        }

    )

    const checkPasswords = () => {
        if (password && rpassword) {
            if (password !== rpassword) {
                setValidatedFields(prev => ({
                    ...prev,
                    password: { error: "passwords must match", valid: false }
                }))
            } else {
                setValidatedFields(prev => ({
                    ...prev,
                    password: { error: null, valid: true }
                }))
            }
        } else {
            setValidatedFields(prev => ({
                ...prev,
                password: { error: null, valid: null }
            }))
        }
    }

    useEffect(() => {
        checkPasswords()
    }, [password, rpassword])
    const history = useHistory()
    console.log(history, "historyya")
    const redirect = history.location.search ? history.location.search.split("=")[1] : ""


    useEffect(() => {
        if (!debouncedUsername) {
            setValidatedFields(prev => ({
                ...prev,
                username: { error: null, valid: null }
            }))
            return
        }

        fetch(`${process.env.REACT_APP_API}/api/v1/validation/users`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: debouncedUsername }),
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
        if (!debouncedEmail) {
            setValidatedFields(prev => ({
                ...prev,
                email: { error: null, valid: null }
            }))
            return;
        }

        fetch(`${process.env.REACT_APP_API}/api/v1/validation/email`, {
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
        fetch(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
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

    const styles = useStyles()
    if (success) {
        //this is not working properly
        return <Redirect to={`/${redirect}`} />
    }
    if (serverError) {
        return <p>{serverError}</p>
    }
    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            className={styles.dialog}
            classes={{ paperWidthFalse: styles.dialog }}
            maxWidth={false}
            onClose={()=>history.goBack()}
        >
            <div
                className="form"
            >
                <h1
                    className="form__title"
                >
                    Register
            </h1>
                <div
                    className="formLocal"
                >
                    <form onSubmit={handleSubmit}
                    >

                        <CustomFormField
                            label="username"
                            field={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            styles={styles}
                            validation={validatedFields.username}
                            type="text"
                        />
                        <CustomFormField
                            label="email"
                            field={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            styles={styles}
                            validation={validatedFields.email}
                            type="text"
                        />
                        <VisibilityToggler>
                            {(visible, toggletVisibility) => {
                                return (
                                    <CustomFormField
                                        isPassword={true}
                                        label="password"
                                        field={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        styles={styles}
                                        validation={validatedFields.password}
                                        type={visible ? "text" : "password"}
                                        endAdornment={<InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggletVisibility}
                                            //onMouseDown={handleMouseDownPassword}
                                            >
                                                {visible ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>}
                                    >
                                    </CustomFormField>
                                )
                            }}
                        </VisibilityToggler>
                        <VisibilityToggler>
                            {(visible, toggletVisibility) => {
                                return (
                                    <CustomFormField
                                        isPassword={true}
                                        label="repeat password"
                                        field={rpassword}
                                        onChange={(e) => { setRpassword(e.target.value) }}
                                        styles={styles}
                                        validation={validatedFields.password}
                                        type={visible ? "text" : "password"}
                                        endAdornment={<InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggletVisibility}
                                            //onMouseDown={handleMouseDownPassword}
                                            >
                                                {visible ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>}
                                    >
                                    </CustomFormField>
                                )
                            }}
                        </VisibilityToggler>

                        <Button
                            disabled={!validatedFields.username.valid || !validatedFields.email.valid}
                            type="submit"
                            color="primary"
                            variant="contained"
                        >submit</Button>
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
                </div>
            </div>
        </Dialog>
    )
}



const CustomFormField = ({ field, type, onChange, label, styles, validation, endAdornment, isPassword = false }) => {
    const theme = useTheme()
    const isSmallViewport = useMediaQuery(theme.breakpoints.down("sm"))
    return (
        <FormControl
            fullWidth
            error={!!validation.error}
            variant="filled"
            required
            className={styles.formField}
            size={isSmallViewport ? "small" : "medium"}
        >
            <InputLabel htmlFor={label}
            >{label}</InputLabel>
            <FilledInput
                id={label}
                error={!!validation.error}
                type={type}
                value={field}
                onChange={onChange}
                endAdornment={
                    validation.valid ?
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                            >
                                <CheckCircleIcon />
                            </IconButton>
                        </InputAdornment>
                        : isPassword ?
                            endAdornment
                            :
                            null
                }
            />
            {!!validation.error && <FormHelperText
                classes={{ root: styles.helperText }}
            >{validation.error}</FormHelperText>}
        </FormControl>
    )
}

const VisibilityToggler = ({ children }) => {
    const [visible, setVisible] = useState(false)
    const toggleVisibility = () => {
        setVisible(prev => !prev)
    }
    return (
        children(visible, toggleVisibility)
    )
}

const Transition = React.forwardRef((props, ref) => {
    return <Grow direction="up" ref={ref} {...props} />;
});