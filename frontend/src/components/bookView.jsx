import React, { useState } from 'react';
import { GetAllBooks } from "../APIWrapper.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../css/styleSheet.css";

const BookView = () => {
    const [books, setBooks] = useState([]);

    const UpdateBookView = () => {
        return (books.map((key, index) =>
            <div key={index}>
                <Link key={index} to={"book?isbn=" + key.isbn}>
                    {
                        `${key.author}: ${key.title} (${key.published.substring(0, 4)})`
                    }
    
                </Link>
            </div>
        ));
    }

    return (
        <div className="bookListingWrapper">
            <button onClick={() => GetAllBooks(setBooks)}>Update</button>
            {UpdateBookView()}
        </div>
    );
}
export default BookView;
