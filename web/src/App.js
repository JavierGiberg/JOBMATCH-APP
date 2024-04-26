import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./components/context/ProdactContex";
import LogInStudent from "./components/LogInStudent/LogInStudent";
import NavigateButton from "./components/NavigateButton/NavigateButton";
function App() {
  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{}}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <header className="App-header">
                    <img src="logo.png" className="App-logo" alt="logo" />
                    <p>SOON...</p>
                    <NavigateButton goTo="/login" button="Student Login" />
                  </header>
                </div>
              }
            />
            <Route path="/login" element={<LogInStudent />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
