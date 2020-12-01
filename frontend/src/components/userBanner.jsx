import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Login, Logout, SignUp } from "../APIWrapper.js";
import UserContext from "./userContext.js";
import "../css/styleSheet.css";
const LoginOrSignUpView = () => {
    const context = useContext(UserContext);
    if(context.isLoggedIn) return <UserDataBanner/>
    return (
        <div>
          <Router>
            <Link to="/login"> Login </Link>
            <Link to="/signup"> Sign Up</Link>
            
            <Route exact path="/login">
              <LoginView/> </Route>
            <Route exact path="/signup">
              <SignUpView/> </Route>
          </Router>
        </div>
    );
}
const LoginView = () => {
    const context = useContext(UserContext);
    const SubmitForm = (e) => {
        Login(e.target["email"].value,
              e.target["password"].value).then(() => {
                  context.SetAccessToken(localStorage.getItem("accessToken"));
                  context.SetUserDataIsDirty(true);
                  context.SetIsLoggedIn(true);
              }).catch((err) => {
                  console.log("Login Form FAIL");
                  console.log(err);
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
const SignUpView = () => {
    const context = useContext(UserContext);
    const SubmitForm = (e) => {
        const name = e.target["name"].value;
        const email = e.target["email"].value;
        const password = e.target["password"].value;
        const role = e.target["role"].value;
        SignUp(name, email, password, role)
            .then(() => {
                  Login(email, password)
                    .then(() => {
                        context.SetAccessToken(localStorage.getItem("accessToken"));
                        context.SetUserDataIsDirty(true);
                        context.SetIsLoggedIn(true);
                    }).catch(err => {
                        console.log("Login Form FAIL");
                        console.log(err);
                    })
            }).catch(err => {
                console.log("Sign Up FAIL");
                console.log(err);
            })
        
        e.preventDefault();
    }
    return (
        <form onSubmit={SubmitForm}>
          <h3> Sign Up </h3>
          
          <label> Name: </label>
          <br/>
          <input type="text" id="name"/>
          <br/>

          <label> Email: </label>
          <br/>
          <input type="email" id="email"/>
          <br/>

          <label> Password: </label>
          <br/>
          <input type="password" id="password"/>

          <br/>
          Role:
          <br/>
          <input type="radio" value="customer" id="customer" name="role"/> 
          <label for="customer"> customer </label>
          <br/>
          <input type="radio" value="admin" id="admin" name="role"/> 
          <label for="customer"> admin </label>
          
          <br/>
          <button type="submit"> sign up </button>
          
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
          {context.isLoggedIn ? <UserDataBanner/> : <LoginOrSignUpView/> }
        </div>
    );
};

export default UserBanner;
