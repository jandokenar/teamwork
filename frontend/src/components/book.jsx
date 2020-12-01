import React, { useState, useContext } from 'react';
import { GetBook, BorrowBook, ReturnBook, ReserveBook } from "../APIWrapper.js";
import UserContext from "./userContext.js";
import "../css/styleSheet.css";

const GetQuery = () => {
    if (window) {
        return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
};

const Book = () => {
    const [book, setBook] = useState(null);
    const [bookUpdate, setBookUpdate] = useState(false);
    const isbn = GetQuery().get("isbn");

    const context = useContext(UserContext);

    const ShowBookCopyActions = (bookCopy) => {

        if (context.currentUser.id) {
            if (bookCopy.status === "in_library" && (bookCopy.reserveList.length < 1 ||
                bookCopy.reserveList[0].reserveId === context.currentUser.id)) {
                return (<button onClick={() =>
                    BorrowBook(context, isbn, bookCopy.id, setBookUpdate)
                        .then(() => { context.SetUserDataIsDirty(true) })}>
                    Borrow</button>);
            } else if (bookCopy.due && bookCopy.borrower === context.currentUser.id) {
                return (
                    <label>
                        <button onClick={() =>
                            ReturnBook(context, isbn, bookCopy.id, setBookUpdate)
                                .then(() => { context.SetUserDataIsDirty(true) })}>
                            Return</button>&nbsp;&nbsp;
                    </label>
                );
            } else if (!bookCopy.reserveList.find(element => element.reserveId === context.currentUser.id) ||
                bookCopy.reserveList.length < 1) {
                return (
                    <label>
                        <button onClick={() => ReserveBook(context, isbn, bookCopy.id, setBookUpdate)}>Reserve</button>&nbsp;&nbsp;
                    </label>
                );
            }
        }
    }

    const ShowReservations = (reserveList) => {

        const userReservation = reserveList.find(element => element.reserveId === context.currentUser.id);
        if (userReservation) {
            return (
                <label>
                    <b>Reservations:&nbsp;&nbsp;</b> {
                        `${reserveList.indexOf(userReservation) + 1}/${reserveList.length}
                     is for you.`}
                </label>
            );
        } else if (reserveList.length > 0) {
            return (
                <label>
                    <b>Reservations: </b>{reserveList.length}
                </label>
            );
        }
    }

    const ShowDueDate = (bookCopy) => {
        if (bookCopy.due) {
            return <label><b>Due Date:&nbsp;&nbsp;</b>{bookCopy.due.substring(0, 10)}&nbsp;&nbsp;</label>
        }
    }

    const MapCopies = () => {
        return (book.copies.map((key, index) =>
            <div key={index}>
                {`${key.id}. (${key.status})`}&nbsp;&nbsp;
                {ShowBookCopyActions(key)}
                {ShowDueDate(key)}
                &nbsp;&nbsp;{ShowReservations(key.reserveList)}
            </div>
        ));
    }

    const GetBookByIsbn = () => {
        if (bookUpdate && book && isbn) {
            return (
                <div>
                    <div>
                        <b>ISBN:&nbsp;&nbsp;</b>
                        {book.isbn}
                    </div>
                    <div>
                        <b>Title:&nbsp;&nbsp;</b>
                        {book.title}
                    </div>
                    <div>
                        <b>Author:&nbsp;&nbsp;</b>
                        {book.author}
                    </div>
                    <div>
                        <b>Published:&nbsp;&nbsp;</b>
                        {book.published}
                    </div>
                    <div>
                        <b>Pages:&nbsp;&nbsp;</b>
                        {book.pages}
                    </div>
                    <div>
                        <b>Description:&nbsp;&nbsp;</b>
                        {book.description}
                    </div>
                    <div>
                        <b>Copies:&nbsp;&nbsp;</b>
                        {MapCopies()}
                    </div>
                </div>
            );
        } else if (isbn && !bookUpdate) {
            setBookUpdate(true);
            GetBook(setBook, isbn);
        }
    }

    return (
        <div className="bookListingWrapper">
            {GetBookByIsbn()}
        </div>
    );
}
export default Book;
