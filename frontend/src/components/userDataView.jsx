import React, { useContext, useState, useEffect } from "react";
import UserContext from "./userContext.js";
import { ModifyUserData } from "../APIWrapper.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const BookLink = (props) => {
    const {book} = props;
    return ( 
        <Link key={book.id} to={"book?isbn=" + book.isbn}>
        <p> {`${book.isbn}`} </p>
        </Link>
    )   
}
const BorrowedBooksContainer = () => {
    const context = useContext(UserContext);
    return (
        <div>
          {context.currentUser.borrowed &&
              context.currentUser.borrowed.map(it => (
                  <BookLink book={it}/>
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
                  <BookLink book={it}/>
              ))}
        </div>
    );
}
const TextOrInputField = (props) => {
    const context = useContext(UserContext);
    const [focused, SetFocused] = useState(false);
    const {
        defaultString,
        inputType,
        SetActiveField,
        activeField,
        fieldIndex,
        fieldTitle,
        objectFieldName,
    } = props;
    const SubmitForm = (e) => {
        const field =  {};
        field[objectFieldName] = e.target["inputBar"].value;

        if(field[objectFieldName]){
            ModifyUserData(field, context.accessToken).then((res) => {
                console.log(res);
                context.SetUserDataIsDirty(true);
                SetFocused(false);
                SetActiveField(-1);
            }).catch((err) => {
                console.log(err);
            });
        }
        e.preventDefault();
    }
    const Unfocused = () => {
        if(activeField === fieldIndex) SetActiveField(-1);
        SetFocused(false);
    }
    useEffect( () => {
        const element = document.getElementById("inputBar");
        if(element) element.focus();
    },[focused]);
    const isEditing = fieldIndex === activeField;
    return(
        <div >
          {isEditing ? 
              <form onSubmit={SubmitForm}>
                    <p> {fieldTitle} </p>
                        <input id={"inputBar"}
                                   type={inputType}
                                   onBlur={Unfocused} ></input>
                            
                  </form>
                  :
                  <div onClick={() => {SetActiveField(fieldIndex);
                                       SetFocused(true)}}
                        
                        >
                        <p> {fieldTitle}: {defaultString} [edit] </p>
                      </div>
                  }
        </div>
    )
}
const UserDataView = () => {
    const [activeField, SetActiveField] = useState(-1);
    
    const context = useContext(UserContext);
    if(!context.isLoggedIn) return <div/>;
    const user = context.currentUser;
    
    return (
        <div>
          <div>
            <TextOrInputField defaultString={user.name}
                              fieldTitle={"Name"}
                              inputType={"text"}
                              fieldIndex={0}
                              activeField={activeField}
                              SetActiveField={SetActiveField}
                              objectFieldName={"name"}
                              />
            <TextOrInputField defaultString={user.email}
                              fieldTitle={"Email"}
                              inputType={"email"}
                              fieldIndex={1}
                              activeField={activeField}
                              SetActiveField={SetActiveField}
                              objectFieldName={"email"}
                              />
            <TextOrInputField defaultString={""}
                              fieldTitle={"Password"}
                              inputType={"password"}
                              fieldIndex={2}
                              activeField={activeField}
                              SetActiveField={SetActiveField}
                              objectFieldName={"password"}
                              />
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
