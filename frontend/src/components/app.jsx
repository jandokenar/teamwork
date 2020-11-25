import React, { useState } from "react";
import UserBanner from "./userBanner.jsx";
import PageContainer from "./pageContainer.jsx";

import UserContext from "./userContext.js";
const App = () => {
    
    const [currentUser, SetCurrentUser] = useState({});
    const [userDataIsDirty, SetUserDataIsDirty] = useState(false);
    return (
        <UserContext.Provider value={{
                                  SetUserDataIsDirty,
                                  SetCurrentUser
                              }}>
          <div className="rootWrapper">
            <header className ="loginWrapper">
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
