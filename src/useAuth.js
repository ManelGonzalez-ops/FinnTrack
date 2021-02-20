import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import { useUserLayer } from "./UserContext"

const useAuth = () => {
  const { authState, authService } = useOktaAuth();
  const { userDispatch } = useUserLayer()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      //userDispatch({ type: "SET_USER_NULL" })
    } else {
      authService.getUser().then(info => {
        console.log("setting user", info)
        if (!info) {
          userDispatch({ type: "SET_USER_NULL" })
        } else {
          userDispatch({ type: "SET_USER", payload: info })
        }
      });
    }
  }, [authState, authService]); // Update if authState changes

};

export default useAuth;