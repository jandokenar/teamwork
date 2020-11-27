import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { GetAllBooks } from "../APIWrapper";

const DeleteBook = () => {
    const [books, setBooks] = useState([]);
    const [oneBook, setOneBook] = useState(null);
    const [search, setSearch] = useState("");
    const [updateBook, setUpdateBook] = useState(false);

    useEffect(() => {
        GetAllBooks(setBooks);
    }, []);

    const HandleDeleteBook = (isbn, id) => {
        axios.delete("http://localhost:5000/library/book", {data:{isbn: isbn, id: id}})
        .then(response => {
            GetAllBooks(setBooks);
            setOneBook(response.data);
        })
    }

    const showSearchedBooks = books.filter(book => book.isbn.startsWith(search));

    const HandleShowOneBook = (isbn) => {
        setOneBook(books.find(book => book.isbn === isbn)); 
    }

    const HandleUpdateBook = () => {
        axios.put("http://localhost:5000/library/book", oneBook)
        .then(response => {
            setUpdateBook(false);
        })
    }

    if (!oneBook) {
    return (
        <div>
            Search book (isbn): <input value={search} onChange={(e) => setSearch(e.target.value)} />
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {showSearchedBooks.map(book => {
                        return (
                            <tr key={book.isbn}>
                                <td>{book.isbn}</td>
                                <td>{book.title}</td>
                                <td><button onClick={() => HandleShowOneBook(book.isbn)}>Info</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table> 
        </div> 
    )
    } else {
        return (
            <div>
                {!updateBook ? <p>Title: {oneBook.title}</p> :
                <div>
                    <label>Title: </label>
                    <input type="text" value={oneBook.title} onChange={(e) =>setOneBook({...oneBook, title: e.target.value})}></input>
                </div>}
                {!updateBook ? <p>Author: {oneBook.author}</p> :
                <div>
                    <label>Author: </label>
                    <input type="text" value={oneBook.author} onChange={(e) =>setOneBook({...oneBook, author: e.target.value})}></input>
                </div>}
                {!updateBook ? <p>Published: {oneBook.published.substring(0, 10)}</p> :
                <div>
                    <label>Published: </label>
                    <input type="date" value={oneBook.published} onChange={(e) =>setOneBook({...oneBook, published: e.target.value})}></input>
                </div>}
                {!updateBook ? <p>Pages: {oneBook.pages}</p> :
                <div>
                    <label>Pages: </label>
                    <input type="number" value={oneBook.pages} onChange={(e) =>setOneBook({...oneBook, pages: e.target.value})}></input>
                </div>}
                {!updateBook ? <p>Description: {oneBook.description}</p> :
                <div>
                    <label>Description: </label>
                    <textarea type="text" value={oneBook.description} onChange={(e) =>setOneBook({...oneBook, description: e.target.value})}></textarea>
                </div>}
                {!updateBook ? <button onClick={() => setUpdateBook(true)}>Update book</button> : <button onClick={HandleUpdateBook}>save</button>}
                <br /><br/>
                <span>Copies: {oneBook.copies.map(copy => {
                    return <div key={copy.id}>
                            <p>ID: {copy.id}</p>
                            <span>Status: {copy.status}</span>
                            {copy.status === "in_library" ?
                                <button onClick={() => HandleDeleteBook(oneBook.isbn, copy.id)}>Delete</button> :
                                <p></p>}
                            <p>-----------</p>
                            </div>
                })}</span>
            </div>
        )
    }
}

export default DeleteBook;