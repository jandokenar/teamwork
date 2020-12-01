import React, { useEffect, useState } from 'react';
import { GetAllBooks, AddBook } from '../APIWrapper';

const AddNewBook = () => {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        GetAllBooks(setBooks);
    }, []);

    const HandleBookSubmit = (e) => {
        e.preventDefault();
        
        AddBook(formData)
        .then(returnedBook => {
            setBooks(books.concat(returnedBook));
            setMessage("Book added to library.");
            document.getElementById("bookForm").reset();
            setTimeout(() => {
                setMessage("")
            }, 1000);
        });
    }

    return (
        <div className="addBookWrapper">
            <h2>Add new book to the library.</h2>
            <form onSubmit={HandleBookSubmit} id="bookForm">
                <label>Book ISBN:</label>
                <input className="bookFormInput" type="text" onChange={(e) => setFormData({...formData, isbn: e.target.value})} required></input><br/><br/>
                <label>Book title:</label>
                <input type="text" onChange={(e) => setFormData({...formData, title: e.target.value})} required></input><br/><br/>
                <label>Book author:</label>
                <input type="text" onChange={(e) => setFormData({...formData, author: e.target.value})} required></input><br/><br/>
                <label>Book published:</label>
                <input type="date" onChange={(e) => setFormData({...formData, published: e.target.value})} required></input><br/><br/>
                <label>Book pages:</label>
                <input type="number" onChange={(e) => setFormData({...formData, pages: e.target.value})} required></input><br/><br/>
                <label>Book description:</label>
                <textarea type="text" onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea><br/><br/>
                <input type="submit" value="Save book"></input>
            </form>
            <h2>{message}</h2>
        </div>
    )
}

export default AddNewBook;