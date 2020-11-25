import React, { useState, useEffect } from "react";
import UserBanner from "./userBanner.jsx";
import PageContainer from "./pageContainer.jsx";

import UserContext from "./userContext.js";
import { RenewAccessToken } from "../APIWrapper.js";
const App = () => {
    
    const [currentUser, SetCurrentUser] = useState({});
    const [userDataIsDirty, SetUserDataIsDirty] = useState(false);
    const [isLoggedIn, SetIsLoggedIn] = useState(false);
    const [refreshInterval, SetRefreshInterval] = useState(null);
    const [accessToken, SetAccessToken] = useState(localStorage.getItem("accessToken"));
    useEffect( () => {
        if(isLoggedIn){
            const tenMinutes = 60 * 1000 * 10;
            const interval = setInterval(
                () => {
                    RenewAccessToken().then(() => {
                        SetUserDataIsDirty();
                        SetAccessToken(localStorage.getItem("accessToken"));
                    }).catch(() => {
                        console.log("CLEAR STATE");
                    })}, tenMinutes);
            SetRefreshInterval(interval);
        }else{
            clearInterval(refreshInterval);
        }
    },[isLoggedIn]);

    return (
        <UserContext.Provider value={{
                                  SetUserDataIsDirty,
                                  SetCurrentUser,
                                  SetIsLoggedIn,
                                  SetAccessToken,
                              }}>
          <div className="rootWrapper">
            <header className ="loginWrapper">
              <p className="TOKEN"> {accessToken} </p>
              <UserBanner/>
            </header>
            <PageContainer/>
            <footer className ="loginWrapper">
              <p>THIS IS FOOTER</p>
            </footer>
          </div>
        </UserContext.Provider>
    )
}
export default App;
