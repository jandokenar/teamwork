import React, { useState } from 'react';
import { GetAllBooks } from "../APIWrapper.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../css/styleSheet.css";

const BookView = () => {
    const [books, setBooks] = useState([]);
    const [booksUpdate, setBookUpdate] = useState(false);

    const UpdateBookView = () => {
        if (booksUpdate) {
            return (books.map((key, index) =>
                <div key={index}>
                    <Link key={index} to={"book?isbn=" + key.isbn}>
                        {
                            `${key.author}: ${key.title} (${key.published.substring(0, 4)})`
                        }
                    </Link>
                </div>
            ));
        } else {
            setBookUpdate(true);
            GetAllBooks(setBooks);
        }
    }


    return (
        <div className="bookListingWrapper">
            {UpdateBookView()}
        </div>
    );
}
export default BookView;
