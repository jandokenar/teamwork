import React, { useContext } from "react";
import UserContext from "./userContext.js";

const BorrowedBooksContainer = () => {
    const context = useContext(UserContext);
    return (
        <div>
          {context.currentUser.borrowed &&
              context.currentUser.borrowed.map(it => (
                  <p> Book : {it.isbn} </p>
              ))}
        </div>
    );
}
const BorrowHistoryContainer = () => {
    const context = useContext(UserContext);
    return (
        <div>
          {context.currentUser.borrowHistory &&
              context.currentUser.borrowHistory.map(it => (
                  <p> Book : it.isbn </p>
              ))}
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
