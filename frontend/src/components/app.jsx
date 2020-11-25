import React from "react"
import PageContainer from "./pageContainer.jsx"
const App = () => (
    <div className="rootWrapper">
      <header className ="loginWrapper">
        <p>THIS IS LOGIN</p>
        </header>
      <PageContainer/>
      <footer className ="loginWrapper">
        <p>THIS IS FOOTER</p>
        </footer>
      
    </div>
)
export default App;
