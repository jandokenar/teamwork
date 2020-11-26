import React, { useState } from 'react';
import { GetAllBooks } from "../APIWrapper.js";
import "../css/styleSheet.css";

const UpdateBookView = (books) => {
    return (books.map((key, index) =>
        <div>
            <a href={key.isbn}>
                {
                    `${key.author}: ${key.title} (${key.published.substring(0, 4)})`
                }
            </a>
        </div>));
}

const BookView = () => {
    const [books, setBooks] = useState([]);

    return (
        <div className="bookListingWrapper">
            <button onClick={() => GetAllBooks(setBooks)}>Update</button>
            {UpdateBookView(books)}
        </div>
    );
}
export default BookView;