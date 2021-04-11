import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton } from '@material-ui/core'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import ReactDOM from "react-dom"
import { ImageUploader } from './ImageUploader'
import "./profileSidebar.scss"
import { useFetchUser } from './UpdateInfoView'
import styled from "styled-components"
import { useUILayer } from '../ContextUI'
import { useUserLayer } from '../UserContext'
import { Link } from 'react-router-dom'
import { ContactDetails } from './ContactDetails'
import { Skeleton } from '@material-ui/lab'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const container = document.getElementById("portal")
const Placeholder = styled.div({
    width: "100%",
    height: "100%",
    background: "grey"
})


export const ProfileSidebar = () => {
    console.log(container, "conteine")
    const { userState } = useUserLayer()
    console.log(userState, "q putopasa")
    const { info } = userState
    const [open, setOpen] = useState("")
    const handleClose = () => {
        setOpen("")
    }
    const handleLoad = () => {
        let debounceLoad = setTimeout(() => {
            setLoaded(true)
            clearTimeout(debounceLoad)
        }, 500)
    }
    const [loaded, setLoaded] = useState(false)


    if (!info.imageUrl && !info.username) {
        return <div className="profile-sidebar"></div>
    }
    return (
        <>
            <div
                className="profile-sidebar"

            >
                <div className="section-image"
                    onClick={() => { setOpen("image") }}
                >


                    {info.imageUrl ?

                        <>
                            {info.imageUrl &&
                                <img src={info.imageUrl}
                                    onLoad={handleLoad}
                                    style={loaded ? { display: "inline" } : { display: "none" }}
                                />
                            }

                            {info.imageUrl && !loaded &&


                                <Skeleton variant="rect"
                                    height="100%"
                                //  style={{ display: "inline-block", minWidth: "65%" }}
                                >
                                    <img src={info.imageUrl} />
                                </Skeleton>

                            }
                        </>
                        :
                        <Fragment>
                            <p>
                                Add photo
                            </p>
                            <IconButton>
                                <AddAPhotoIcon />
                            </IconButton>
                        </Fragment>
                    }



                </div>
                <div className="section-text"
                    onClick={() => { setOpen("text") }}
                >
                    {info ?

                        <TextSection {...{ info }}
                        />
                        :
                        <Skeleton variant="rect" height="100%" style={{ display: "inline-block", minWidth: "65%" }}>
                            <TextSection info={{ username: "benitocam" }} />
                        </Skeleton>
                    }

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

const skeletonRelleno = { username: "benitocame" }
const TextSection = ({ info }) => {

    if (!info.firstName) {

        return (
            <>
                <h3>{info.username}</h3>
                <Button>edit profile</Button>
            </>)
    }
    return (
        <>
            <h3>{info.firstName}</h3>
            {info.lastName && <p>{info.lastName}</p>}

            <Button>
                edit profile
            </Button>
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
                color="secondary"
            >Close</Button>
        </DialogActions>
    </Dialog>,
        container)
    )
}
