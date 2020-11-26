import React, { useState } from 'react';
import GetAllBooks from "../APIWrapper.js";

const UpdateBookView = (books) => {
    let output;
    output = Object.keys(books).map((key, index) =>
        <div>
            <a href={books[key].isbn}>
            {
                `${books[key].author}: ${books[key].title} (${books[key].published.substring(0,4)})`
            }
            </a>
        </div>);
    return (output);
}

const BookView = () => {
    const [books, setBooks] = useState(null);
    if (books) {
        return (
            <div className="bookListingWrapper">
                <button onClick={() => GetAllBooks(setBooks)}>Update</button>
                {UpdateBookView(books)}
            </div>
        );
    } else {
        return (
            <div className="bookListingWrapper">
                <button onClick={() => GetAllBooks(setBooks)}>Update</button>
            </div>
        );
    }

}
export default BookView;