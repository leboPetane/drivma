import { Navigation } from "./components/Navigation";
import { Dashboard }  from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { Cars } from "./components/Cars";
import { Schedule } from "./components/Schedule";
import { Students } from "./components/Students";
import { useState }   from "react"; 
import { Routes } from "react-router";
import Login from "./components/Login";

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

function App() {

  /* State Properties */
  const [drivingSchool, setDrivingSchool] = useState("He & She");
  const [loggedIn, setLoggedIn] = useState(false);

  const signIn = () => {
    setLoggedIn(true);
  }

  const signOut = () => {
    setLoggedIn(false);
  }

  return (
    <Router>
      {loggedIn ?
    <div className="App">
        <Navigation driving_school={drivingSchool} logout={signOut}/> 
        <div className="main-panel">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <Routes>
                    <Route path='/'            exact element={<Dashboard/>} />
                    <Route path='/instructors' exact element={<Cars/>} />
                    <Route path='/cars'        exact element={<Cars/>} />
                    <Route path='/schedule'    exact element={<Schedule/>} />
                    <Route path='/students'    exact element={<Students/>} />
                    <Route path='/lessons'     exact element={<Lessons/>} />
                  </Routes>
              </div>
            </div>
          </div>
        </div>
        </div> : 
          <Login signin={signIn}/>
        }
    </Router>
    
  );
}

export default App;
