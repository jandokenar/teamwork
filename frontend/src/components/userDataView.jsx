import React, { useContext } from "react";
import UserContext from "./userContext.js";

const UserDataView = () => {
    const context = useContext(UserContext);
    
    if(!context.isLoggedIn) return <div/>;

    const user = context.currentUser;
    
    return (
        <div>
          <div>
            <p> Name: {user.name} </p>
            <p> Email: {user.email}</p>
            <p> fees: {user.fees} €</p>
            <p> Borrowed: </p>
            <p> BorrowHistory: </p>
          </div>
        </div>
    );
}

export default UserDataView;
