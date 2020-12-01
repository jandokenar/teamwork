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

//Determines if nav button is rendered to user
const securityAccess = {
    "customer": 0,
    "admin": 1,
    "hiddenForAll": 2, //If we wan't to hide nav buttons from every user.
}
//@NOTE
//Add new page here, Key is the text that is displayed on the nav button
//Link is key without whitespace
const routeViewBindings = {
    "All Books" : {
        offlineView: true,
        minSecAccess: securityAccess.customer,
        view: <BookView/>,
    },
    "Book" : {
        hidden: true,
        minSecAccess: securityAccess.customer,
        view: <Book/>,
    },
    "Add Book" : {
        minSecAccess: securityAccess.admin,
        view: <AddNewBook />,
    },
    "My Data":  {
        minSecAccess: securityAccess.customer,
        view: <UserDataView/>,
    },
    "Delete Book" : {
        minSecAccess: securityAccess.admin,
        view: <DeleteOrUpdateBook />,
    },
    "Delete User" : {
        minSecAccess: securityAccess.admin,
        view: <DeleteUser />,
    },
};

const PageContainer = () => {
    const context = useContext(UserContext);
    return (
        <div className="pageWrapper">
          <Router>
            <div className="navBarWrapper">
              {Object.keys(routeViewBindings).map(it => {
                  //if route has offlineView set to 'true', or if user is logged in and
                  //has the neccessary role
                  const viewable = routeViewBindings[it].offlineView ||
                        ((context.currentUser.email !== undefined) && 
                         (securityAccess[context.currentUser.role] >= 
                          routeViewBindings[it].minSecAccess));
                                                  
                  if(!viewable || routeViewBindings[it].hidden) return ("");
                  return (
                      <Link key={it} to={it.replace(" ", "")}>
                        <button className="navBarButton" >
                          {it}
                        </button>
                      </Link>
                  )
              })}                                                 
        </div>
            <div className="pageViewWrapper">
            {Object.keys(routeViewBindings).map((it) => {
                const viewable = routeViewBindings[it].offlineView ||
                      ((context.currentUser.email !== undefined) && 
                       (securityAccess[context.currentUser.role] >= 
                        routeViewBindings[it].minSecAccess));
                
                const path = it.replace(" ", "");
                
                return (
                    <Route exact key={it} path={`/${path}`}>
                      {viewable && routeViewBindings[it].view }
                    </Route>   
                )
            })}
            </div>
            </Router>
        </div>

    )
}
export default PageContainer;
