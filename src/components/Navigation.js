import { Link }       from "react-router-dom";
import { useState } from "react";

export const Navigation = ({driving_school, logout}) => {

    const [uriPath, setUriPath] = useState("/")

    return (
        <>
        <div className="sidebar" data-color="white" data-active-color="danger">
            <div className="logo">
                <a href="#" className="simple-text logo-mini"></a>
                <a href="#" className="simple-text logo-normal"> Menu </a>
            </div>

            <div className="sidebar-wrapper">
                <ul className="nav">
                    
                    <li className={(uriPath === "/" ? "active" : "")}>
                        <Link to="/" onClick={() => setUriPath("/")}>
                            <i className="nc-icon nc-badge"></i>
                            <p>Instructors</p>
                        </Link>
                    </li>
                    <li className={(uriPath === "schedule" ? "active" : "")}>
                        <Link to="schedule" onClick={() => setUriPath("schedule")}>
                        <i className="nc-icon nc-calendar-60"></i>
                        <p>Schedule</p>
                        </Link>
                    </li>
                    <li className={(uriPath === "cars" ? "active" : "")}>
                        <Link to="cars" onClick={() => setUriPath("cars")}>
                            <i className="nc-icon nc-bus-front-12"></i>
                            <p>Cars</p>
                        </Link>
                    </li>
                    <li className={(uriPath == "students" ? "active" : "")}>
                        <Link to="students" onClick={() => setUriPath("students")}>
                        <i className="nc-icon nc-single-02"></i>
                        <p>Students</p>
                        </Link>
                    </li>
                    {/* <li className={(path == "/lessons" ? "active" : "")}>
                        <a href="/lessons">
                        <i className="nc-icon nc-money-coins"></i>
                        <p>Lesson Plans</p>
                        </a>
                    </li> */}
                    
                </ul>
                <div className="center text-center">
                 <button className="btn btn-danger  btn-round" onClick={() => logout()}>Logout</button>

                </div>

            </div>
        </div>
        <div className="main-panel">
        <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
          <div className="container-fluid">
            <div className="navbar-wrapper">
              <div className="navbar-toggle">
                <button type="button" className="navbar-toggler">
                  <span className="navbar-toggler-bar bar1"></span>
                  <span className="navbar-toggler-bar bar2"></span>
                  <span className="navbar-toggler-bar bar3"></span>
                </button>
              </div>
              <a className="navbar-brand" href="#">{driving_school} Driving School</a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-bar navbar-kebab"></span>
              <span className="navbar-toggler-bar navbar-kebab"></span>
              <span className="navbar-toggler-bar navbar-kebab"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navigation">
              
              
            </div>
          </div>
        </nav>
        </div>
        
        </>
    )
}
