import React, { useEffect, useState } from "react";
import { DeleteOneUser, GetAllUsers } from "../APIWrapper.js";

const DeleteUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        GetAllUsers()
        .then(response => {
            setUsers(response);
        })
    }, []);

    const handleDeleteUser = (id) => {
        DeleteOneUser(id)
        .then(response => 
            setUsers(users.filter(user => user.id !== id))
        )
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