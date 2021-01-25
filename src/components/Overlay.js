import React from 'react'
import { Transition } from 'react-transition-group'
import { useUILayer } from '../ContextUI'

export const Overlay = () => {
    const { showOverlay } = useUILayer()
    const defaultStyles = {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "opacity 0.3s ease",
        zIndex: 2000
    }
    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 1 },
        exited: { opacity: 0 }
    }
    return (
        <div
        >
            <Transition
                in={showOverlay}
                mountOnEnter
                unmountOnExit
            >
                {state => (
                    <div
                        style={{ ...defaultStyles, ...transitionStyles[state] }} />

                )}
            </Transition>
        </div>
    )
}
