import React, { useContext }from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import BookView from "./bookView.jsx"
import Book from "./book.jsx"
import AddNewBook from "./addNewBook";
import UserDataView from "./userDataView.jsx";
import UserContext from "./userContext.js";
import "../css/styleSheet.css";
import DeleteOrUpdateBook from "./deleteOrUpdateBook.jsx";
import DeleteUser from "./deleteUser";

//@NOTE
//Add new page here, Key is the text that is displayed on the nav button
//Link is key without whitespace
//value is the component which should be rendered in viewContainer
const securityAccess = {
    "customer": 0,
    "admin": 1,
}
const routeViewBindings = {
    "All Books" : <BookView/>,
    "Book" : <Book/>,
    "Add Book" : <AddNewBook />,
    "My Data":  <UserDataView/>,
    "Delete Book" : <DeleteOrUpdateBook />,
    "Delete User" : <DeleteUser />,
};

const PageContainer = () => {
    const context = useContext(UserContext);
    return (
        <div className="pageWrapper">
          <Router>
            <div className="navBarWrapper">
              {Object.keys(routeViewBindings).map(it => {
                if(it !=="Book"){
                  return (
                      <Link key={it} to={it.replace(" ", "")}>
                        <button className="navBarButton" >
                          {it}
                        </button>
                      </Link>
                  )
                }
                return ("");
              })}                                                 
        </div>
            <div className="pageViewWrapper">
            {Object.keys(routeViewBindings).map((it) => {
                const path = it.replace(" ", "");
                return (
                    <Route exact key={it} path={`/${path}`}>
                      {routeViewBindings[it]}
                    </Route>
                )})}
            </div>
            </Router>
        </div>

    )
}
export default PageContainer;
