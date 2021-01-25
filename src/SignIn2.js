import React, { useContext, useRef, useState } from 'react'
import { Context } from "./Context"
import { Formik, useField, Form } from "formik"
import { TextField, Button, Paper, makeStyles } from "@material-ui/core"
import * as yup from 'yup';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';

const useStyles = makeStyles({
    root: {
        width: "100%",
        marginBottom: "1.5rem"
    }
})
export default function Formm({ issuer }) {
    const { authService } = useOktaAuth();
    const [sessionToken, setSessionToken] = useState();
    const userData = useRef("")
    const classes = useStyles()
    const CustomTextField = ({ label, ...props }) => {

        const [field, meta] = useField(props)
        const errorText = meta.error && meta.touched ? meta.error : "";
        return (<TextField
            label={label}
            {...field}
            {...props}
            helperText={errorText}
            error={!!errorText}
            variant="outlined"
            classes={{ root: classes.root }}
            autoComplete="off"

        />)
    }

    const validationSchema = yup.object({
        username: yup
            .string()
            .required()
            .max(100),
        email: yup
            .string()
            .email()
            .required()
            .max(100),
        apellido: yup
            .string()
            .required()
            .max(100),
        password: yup
            .string()
            .required()
            .max(10000),
    });

    console.log(validationSchema, "validacion")
    const handleSubmit = (values) => {
        const { email, password } = values

        const oktaAuth = new OktaAuth({
            // If your app is configured to use the Implicit Flow
            // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
            // you will need to uncomment the below line:
            // pkce: false,
            issuer: issuer
        });
        oktaAuth.signIn({ username: email, password })
            .then(res => {
                const sessionToken = res.sessionToken;
                setSessionToken(sessionToken);
                // sessionToken is a one-use token, so make sure this is only called once
                authService.redirect({ sessionToken });
            })
            .catch(err => console.log('Found an error', err));
    };

    const handleSubmita = (e) => {
        console.log(e.value, "suuumitao")
    }
    console.log(userData.current, "userData")



    if (sessionToken) {
        // Hide form while sessionToken is converted into id/access tokens
        return null;
    }


    return (
        <div >

            <Formik initialValues={{
                username: "",
                email: "",
                password: ""
            }}

                validationSchema={validationSchema}
                validateOnChange={true}
                onSubmit={(values, { setSubmitting }) => {
                    console.log("trolaos maricon")
                    setTimeout(() => {
                        handleSubmit(values)
                        setSubmitting(false);
                    }, 400);
                }}
            >

                {(({ values, handleChange, handleBlur, handleSubmit, errors }) => {
                    return (
                        <Paper
                            elevation={3}
                            className="form-wrap"
                        >
                            <h1 className="header-form">Contact Me!</h1>
                            <Form
                                style={{ textAlign: "left", padding: "1.5rem" }}
                            >
                                <input type="hidden" name="form-name" value="form1" />
                                <div className="wrap-input">
                                    <CustomTextField
                                        required
                                        name="username"
                                        label="username"
                                    />
                                </div>
                                <div className="wrap-input">
                                    <CustomTextField
                                        required
                                        name="email"
                                        label="email"
                                    />
                                </div>
                                <div className="wrap-input">
                                    <CustomTextField
                                        required
                                        name="password"
                                        label="password"
                                    />
                                </div>
                                <Button type="submit"
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    disabled={Object.keys(errors).length > 0}
                                >Submit</Button>
                            </Form>
                        </Paper>
                    )
                })}
            </Formik>

        </div>

    )
}
