import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../css/styleSheet.css";

//@NOTE
//Add new page here, Key is the text that is displayed on the nav button
//Link is key without whitespace
//value is the component which should be rendered in viewContainer
const routeViewBindings = {
    "Search Book" : <p> Tadaa </p>,
    "B" : <p> B </p>,
    "C" : <p> C </p>,
};

const PageContainer = () => {
    return (
        <div className="pageWrapper">
          <Router>
            <div className="navBarWrapper">
              {Object.keys(routeViewBindings).map(it => {
                  return (
                      <Link to={it.replace(" ", "")}>
                        <button className="navBarButton">
                          {it}
                        </button>
                      </Link>
                  )})
              }
            </div>
            <div className="pageViewWrapper">
            {Object.keys(routeViewBindings).map((it) => {
                const path = it.replace(" ", "");
                return (
                    <Route exact path={`/${path}`}>
                      {routeViewBindings[it]}
                    </Route>
                )})}
            </div>
            </Router>
        </div>

    )
}
export default PageContainer;
