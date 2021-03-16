import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grow } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ReactDOM from "react-dom"
import { ImageUploader } from './ImageUploader'
import "./profileSidebar.scss"
import { useFetchUser } from './UpdateInfoView'
import styled from "styled-components"
import { useUILayer } from '../ContextUI'

const container = document.getElementById("portal")
const Placeholder = styled.div({
    width: "100%",
    height: "100%",
    background: "grey"
})

const generateUrl = (blobData) => {
    return URL.createObjectURL(blobData)
}
export const ProfileSidebar = () => {
    console.log(container, "conteine")
    const { imageUrl, setImageUrl } = useUILayer()
    const image = useFetchUser("image")
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }


    useEffect(() => {
        if (image.data && !imageUrl) {
            setImageUrl(() => generateUrl(image.data))
        }
    }, [image])
    return (
        <>
            <div
                className="profile-sidebar"
                onClick={() => { setOpen(true) }}
            >
                <div className="section image">
                    {/* {image.loading ? <CircularProgress />
                    : image.error ? <p>{error}</p>
                        : image.data ? <img src={image.data} />
                            : <Placeholder />} */}
                    <ImageHandler {...{ image }}>
                        {imageUrl ? <img src={imageUrl} /> : <CircularProgress />}
                    </ImageHandler>
                </div>
                <div className="section text">
                    <h3>Manel</h3>
                    <p>editar datos</p>
                </div>
            </div>
            <DialogUser {...{ open, handleClose, image }} />
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

const DialogUser = ({ handleClose, open, image }) => {

    // const [openModal, setOpenModal] = useState(false)

    // useEffect(() => {
    //     if (open && !openModal) {
    //         setOpenModal(true)
    //     }
    //     else{
    //         setOpenModal(false)
    //     }
    // }, [open])

    // const close = () => {
    //     setOpenModal(false)
    // }

    return (<Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={GrowTransition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        {image.data ?
            <>
                <DialogTitle>
                    Update profile picture
                </DialogTitle>
                <DialogContent>
                    <ImageUploader image={image.data} />
                </DialogContent>
            </>
            :
            <CircularProgress />
        }
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
    </Dialog>
    )
}
