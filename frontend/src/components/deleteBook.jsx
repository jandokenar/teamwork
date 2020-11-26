import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteBook = () => {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/library/book/all")
        .then(returnedBooks => {
            setBooks(returnedBooks.data);
        })
    }, []);

    return (
        <div>
            <h2>Books:</h2>
            {books.map(book => {
                return <div key={book.isbn}>
                        <p>{book.title}</p>
                        <span>copies: {book.copies.map(copy => {
                            return <div key={copy.id}>
                                    <span>ID: {copy.id}</span>
                                    {copy.status === "in_library" ?
                                        <button>Delete</button> :
                                        <p></p>}
                                </div>
                        })}</span>
                        <p>-----------</p>
                    </div>
            })}
        </div>
    )
}

export default DeleteBook;