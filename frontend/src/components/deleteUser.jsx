import React, { useEffect, useState, useContext } from "react";
import { DeleteOneUser, GetAllUsers } from "../APIWrapper.js";
import UserContext from "./userContext.js";
const DeleteUser = () => {
    const [users, setUsers] = useState([]);
    const context = useContext(UserContext);
    useEffect(() => {
        GetAllUsers()
            .then(response => {
                setUsers(response);
            })
    }, []);
    
    const handleDeleteUser = (id) => {
        DeleteOneUser(id)
            .then(response => {
                  setUsers(users.filter(user => user.id !== id));
                context.SetUserDataIsDirty(true);
            })
    }
    
    return (
        <div>
            <p>Users:</p>
            {users.map(user => {
                return (
                    <div key={user.id}>
                        <span>{user.name}</span>
                        <button onClick={() => handleDeleteUser(user.id)}>delete</button>
                    </div>
                )
            })}
        </div>
    )
}

export default DeleteUser;
