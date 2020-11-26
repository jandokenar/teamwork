import React, { useContext } from "react";
import UserContext from "./userContext.js";

const BorrowedBooksContainer = () => {
    return (
        <div>
          <p> books </p>
        </div>
    );
}
const BorrowHistoryContainer = () => {
    return (
        <div>
          <p> history </p>
        </div>
    );
}
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
            <BorrowedBooksContainer/>
            <p> BorrowHistory: </p>
            <BorrowHistoryContainer/>
          </div>
        </div>
    );
}

export default UserDataView;
