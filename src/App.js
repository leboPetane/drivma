import { Navigation } from "./components/Navigation";
import { Dashboard }  from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { Cars } from "./components/Cars";
import { Schedule } from "./components/Schedule";
import { Students } from "./components/Students";
import { useState, useEffect }   from "react"; 
import { Routes } from "react-router";
import Login from "./components/Login";

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { withCookies, Cookies } from "react-cookie";

function App() {

  useEffect(() => {
    let cookie = new Cookies();
    if (cookie.get('UserLoggedIn')){
      setLoggedIn(true);
    }
  });
  /* State Properties */
  const [drivingSchool, setDrivingSchool] = useState({});
  const [instructors, setInstructors]     = useState({});
  const [loggedIn, setLoggedIn]           = useState(false);

  const signIn = (userObj) => {
    let cookie = new Cookies();
    cookie.set("UserLoggedIn", true);
    cookie.set("userId", userObj._id);
    setDrivingSchool(userObj);

    const getInstructors = async () => {
      const instrucs = await getInstructorsFromServer(userObj._id);
      if(instrucs) setInstructors(instrucs);
    }

    getInstructors();
    setLoggedIn(true);
  }

  const getInstructorsFromServer = async (drivingSchoolId) => {
    const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors`, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
      }
    });
    const data = await res.json();
    const instrucs = data.filter((obj) => obj.driving_school_id === drivingSchoolId);

    return instrucs;

  }

  const signOut = () => {
    let cookie = new Cookies();
    cookie.remove("UserLoggedIn");
    cookie.remove("userId");
    setLoggedIn(false);
  }

  return (
    <Router>
      {loggedIn ?
    <div className="App">
        <Navigation driving_school={drivingSchool.driving_school} logout={signOut}/> 
        <div className="main-panel">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <Routes>
                    <Route path='/'            exact element={<Dashboard instruct={instructors} logout={signOut}/>} />
                    <Route path='/instructors' exact element={<Cars/>} />
                    <Route path='/cars'        exact element={<Cars/>} />
                    <Route path='/schedule'    exact element={<Schedule logout={signOut}/>} />
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
