import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grow } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from "react-dom"
import { ImageUploader } from './ImageUploader'
import "./profileSidebar.scss"
import { useFetchUser } from './UpdateInfoView'
import styled from "styled-components"
import { useUILayer } from '../ContextUI'
import { useUserLayer } from '../UserContext'
import { Link } from 'react-router-dom'
import { ContactDetails } from './ContactDetails'

const container = document.getElementById("portal")
const Placeholder = styled.div({
    width: "100%",
    height: "100%",
    background: "grey"
})


export const ProfileSidebar = () => {
    console.log(container, "conteine")
    const { userState: { info } } = useUserLayer()
    const [open, setOpen] = useState("")
    const handleClose = () => {
        setOpen("")
    }


    return (
        <>
            <div
                className="profile-sidebar"

            >
                <div className="section-image"
                    onClick={() => { setOpen("image") }}
                >
                    {/* {image.loading ? <CircularProgress />
                    : image.error ? <p>{error}</p>
                        : image.data ? <img src={image.data} />
                            : <Placeholder />} */}
                    {/* <ImageHandler {...{ image }}>
                        {info.imageUrl ? <img src={info.imageUrl} /> : <CircularProgress />}
                    </ImageHandler> */}
                    {info.imageUrl ? <img src={info.imageUrl} /> : <CircularProgress />}

                </div>
                <div className="section-text"
                    onClick={() => { setOpen("text") }}
                >
                    <TextSection {...{ info }}
                    />
                    <p>edit user profile</p>
                </div>
            </div>
            <DialogUser
                title="Update profile Picture"
                {...{ open, handleClose }} />
            <DialogText {...{ open, handleClose, info }}
                title="Update profile information"
            />

        </>
    )
}

const TextSection = ({ info }) => {

    if (!info.firstName) {
        return <h3>{info.username}</h3>
    }
    return (
        <>
            <h3>{info.firstName}</h3>
            {info.lastName && <p>{info.lastName}</p>}
        </>
    )
}
const ImageHandler = ({ image, children }) => {
    if (image.loading) {
        return <p>cargando...</p>
    }
    if (image.error) {
        return <p>{image.error}</p>
    }
    if (image.data) {
        return <>{children}</>
    }
    else {
        return <p>que cojones</p>
    }
    return <>

    </>
}
const GrowTransition = React.forwardRef((props, ref) => (
    <Grow ref={ref} {...props} />
))



const DialogUser = ({ handleClose, open, title }) => {

    return (ReactDOM.createPortal(<Dialog
        open={open === "image"}
        onClose={handleClose}
        TransitionComponent={GrowTransition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >


        <DialogTitle>
            {title}
        </DialogTitle>
        <DialogContent>
            <ImageUploader />

        </DialogContent>


        <DialogActions>
            <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
            >Close</Button>
            <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
            >Cancel</Button>
        </DialogActions>
    </Dialog>,
        container)
    )
}
const DialogText = ({ handleClose, open, info, title }) => {

    return (ReactDOM.createPortal(<Dialog
        open={open === "text"}
        onClose={handleClose}
        TransitionComponent={GrowTransition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >


        <DialogTitle>
            {title}
        </DialogTitle>
        <DialogContent>
            <ContactDetails userInfo={info} />
        </DialogContent>


        <DialogActions>
            <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
            >Close</Button>
            <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
            >Cancel</Button>
        </DialogActions>
    </Dialog>,
        container)
    )
}
