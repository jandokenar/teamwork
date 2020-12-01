import React, { useState, useEffect } from "react";
import UserBanner from "./userBanner.jsx";
import PageContainer from "./pageContainer.jsx";

import UserContext from "./userContext.js";
import { RenewAccessToken, GetUserData } from "../APIWrapper.js";
const App = () => {
    
    const [currentUser, SetCurrentUser] = useState({});
    const [userDataIsDirty, SetUserDataIsDirty] = useState(true);
    const [accessToken, SetAccessToken] = useState(localStorage.getItem("accessToken"));
    const [isLoggedIn, SetIsLoggedIn] = useState(accessToken? true : false);
    const [refreshInterval, SetRefreshInterval] = useState(null);
    const ClearState = () => {
        SetCurrentUser({});
        SetIsLoggedIn(false);
        SetAccessToken(null);
        localStorage.removeItem("accessToken");
    }
    useEffect(() => {
        const UpdateUserData = async () => {
            GetUserData(accessToken).then((user) => {
                SetUserDataIsDirty(false);
                SetCurrentUser(user);
            }).catch((err) => {
                ClearState();            
            });
        }
        if(userDataIsDirty) UpdateUserData();
    },[userDataIsDirty, accessToken]);

    useEffect( () => {
        if(isLoggedIn){
            const tenMinutes = 60 * 1000 * 10;
            const interval = setInterval(
                () => {
                    RenewAccessToken().then(() => {
                        SetAccessToken(localStorage.getItem("accessToken"));
                    }).catch(() => {
                        SetUserDataIsDirty(true);
                        ClearState();
                    })}, tenMinutes);
            SetRefreshInterval(interval);
        }else{
            clearInterval(refreshInterval);
            ClearState();
        }
    },[isLoggedIn]);
    
    return (
        <UserContext.Provider value={{
                                  SetUserDataIsDirty,
                                  SetCurrentUser,
                                  currentUser,
                                  SetIsLoggedIn,
                                  isLoggedIn,
                                  SetAccessToken,
                                  accessToken,
                              }}>
          <div className="rootWrapper">
            <header className ="loginWrapper">
              <UserBanner/>
            </header>
            
            <PageContainer/>
            
            <footer className ="footerWrapper">
              <h5>Learn & Code FULLSTACK 2020, Group-b</h5>
              <p>Henrik Peteri, Arto Kujala, Matti Puuperä</p>
            </footer>
          </div>
        </UserContext.Provider>
    )
}
export default App;
