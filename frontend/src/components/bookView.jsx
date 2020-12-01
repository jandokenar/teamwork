import React, { useState, useEffect } from 'react';
import { GetAllBooks } from "../APIWrapper.js";
import { Link } from "react-router-dom";

import "../css/styleSheet.css";

const BookView = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("author");

    useEffect(() => {
        GetAllBooks(setBooks);
    }, [])

    const sortedBooks = books.sort((a, b) => {
        const authorA = a.author.toLowerCase();
        const authorB = b.author.toLowerCase();

        if (authorA < authorB) {
            return -1;
        }
        if (authorA > authorB) {
            return 1;
        }
        return 0;
    });
    
    const showSearchedBooks = sortedBooks.filter(book => book[searchBy].toLowerCase().startsWith(search.toLowerCase()));

    const UpdateBookView = () => {
        return (
            <div>
                Search book by <select onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="author">Author</option>
                    <option value="title">Title</option>
                    <option value="isbn">ISBN</option>
                    </select>: 
                    <input placeholder="Enter value here" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {showSearchedBooks.length < 21 ?
                    showSearchedBooks.map((key, index) =>
                        <div key={index}>
                            <Link key={index} to={"book?isbn=" + key.isbn}>
                                {
                                    `${key.author}: ${key.title} (${key.published.substring(0, 4)})`
                                }
                            </Link>
                        </div>
                    ) : <div></div>}
            </div>
        );
    }


    return (
        <div className="bookListingWrapper">
            {UpdateBookView()}
        </div>
    );
}
export default BookView;
