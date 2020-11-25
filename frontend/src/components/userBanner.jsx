import React, { useContext } from "react";
import { Login } from "../APIWrapper.js";
import UserContext from "./userContext.js";
const LoginView = () => {
    const context = useContext(UserContext);

    const SubmitForm = (e) => {
        console.log(e.target["email"].value);
        console.log(e.target["password"].value);
        Login(e.target["email"].value,
              e.target["password"].value).then(() => {
                  context.SetUserDataIsDirty(true);
              }).catch((e) => {
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
const UserBanner = () => {
    return(
        
        <div>
          <p> this is user banner </p>
          <LoginView/>
        </div>
    );
};

export default UserBanner;
