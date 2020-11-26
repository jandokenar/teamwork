import React, { useContext } from "react";
import { Login, Logout } from "../APIWrapper.js";
import UserContext from "./userContext.js";
import "../css/styleSheet.css";
const LoginView = () => {
    const context = useContext(UserContext);

    const SubmitForm = (e) => {
        Login(e.target["email"].value,
              e.target["password"].value).then(() => {
                  context.SetAccessToken(localStorage.getItem("accessToken"));
                  context.SetUserDataIsDirty(true);
                  context.SetIsLoggedIn(true);
              }).catch((e) => {
                  console.log("Login Form FAIL");
                  console.log(e);
              });
        
        e.preventDefault();
    }
    return (
        <form onSubmit={SubmitForm}>
          <h3> Login </h3>
          
          <label> Email: </label>
          <br/>
          <input type="email" id="email"/>
          <br/>

          <label> Password: </label>
          <br/>
          <input type="password" id="password"/>
          <br/>
          <button type="submit"> login </button>
          
        </form>
    );
}
const UserDataBanner = () => {
    const context = useContext(UserContext);
    const LogoutOnClick = (e) => {
        Logout().then(() => {
            context.SetUserDataIsDirty(true);
            context.SetIsLoggedIn(false); 
        }).catch( err => {
            console.log(err);
            context.SetUserDataIsDirty(true);
            context.SetIsLoggedIn(false);
        });
    }
    return (
        <div>
          <p> Name: {context.currentUser.name} </p>
          <p> Email: {context.currentUser.email} </p>
          <button onClick={(e) => LogoutOnClick(e)}> Log Out </button>
        </div>
    )
}
const UserBanner = () => {
    const context = useContext(UserContext);
    
    return(
        <div>
          {context.isLoggedIn ? <UserDataBanner/> : <LoginView/> }
        </div>
    );
};

export default UserBanner;
