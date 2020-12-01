import React, { useState } from 'react';
import { GetAllBooks } from "../APIWrapper.js";
import { Link } from "react-router-dom";

import "../css/styleSheet.css";

const BookView = () => {
    const [books, setBooks] = useState([]);
    const [booksUpdate, setBookUpdate] = useState(false);
    const [search, setSearch] = useState("");

    const showSearchedBooks = books.filter(book => book.author.toLowerCase().startsWith(search.toLowerCase()));

    const UpdateBookView = () => {
        if (booksUpdate) {
            return (
                <div>
                    Search book (author): <input value={search} onChange={(e) => setSearch(e.target.value)} />
                {showSearchedBooks.map((key, index) =>
                    <div key={index}>
                        <Link key={index} to={"book?isbn=" + key.isbn}>
                            {
                                `${key.author}: ${key.title} (${key.published.substring(0, 4)})`
                            }
                        </Link>
                    </div>
                    )}
                </div>
            );
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
