import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const MySchedule = () => {

    const [firstName, setFirstName]             = useState("John")
    const [lastName, setLastName]               = useState("Doe")
    const [schedules, setSchedules]             = useState([])
    const [signedIn, setSignedIn]               = useState(false);
    const [errMsg, setErrMsg]                   = useState("");
    const [email, setEmail]                     = useState("");
    const [passcode, setPasscode]               = useState("");
    const [isLoading, setIsLoading]             = useState(false);

  const seeSchedule = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      var res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    });
    var data = await res.json();
    var instructor = data.filter((obj) => obj.email === email && obj.passcode === passcode)[0];

    if (!instructor){
        setIsLoading(false);
        setErrMsg("We could not find your instructor profile. Please speak to your driving school to update your details");
        return;
    }

    setFirstName(instructor.first_name);
    setLastName(instructor.first_name);

    res  = await fetch(`${process.env.REACT_APP_API_URL}/api/lessons`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (res.status !== 200){
        setErrMsg("Something went wrong: " + res.statusText);
    }
    setIsLoading(false);
    data = await res.json();
    var tempDt   = new Date();
    var dtString = tempDt.getDate() + "/" + tempDt.getMonth() + "/" + tempDt.getFullYear();
    var lessons  = data.filter((obj) => obj.instructor_id === instructor._id && obj.date === dtString);
    setSchedules(lessons);

    setSignedIn(true);
  }  
  return (

    <>
    {signedIn ?
    <div className = "col-md-4">
                <div className="card card-user">
                <div className="image">
                    
                </div>
                <div className="card-body">
                    <div className="author">
                        <a href="#">
                            <h5 className="title">{firstName + " " + lastName}</h5>
                        </a>
                        <p className="description">  {(new Date()).toDateString()}</p>
                    </div>
                    <table className="table">
                   <thead className=" text-primary">
                       <tr>
                            <th> Time        </th>
                            <th> Description </th>
                            {/* <th>       </th> */}
                       </tr>
                    </thead>
                    <tbody>
                      {schedules.map((lesson) => 
                        <tr key={lesson._id}>
                          <th> {lesson.time}:00 </th>
                          <td>  {true ? <p> Lesson with {lesson.learner} <span className='badge badge-warning'> {lesson.area} </span></p> : ""}  </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <button className='btn btn-lg btn-primary btn-block' onClick={() => setSignedIn(false)}>Close</button>
                </div>
                
                </div>
            </div>:
            <div className="card-body">
          
                    <div className='container text-center mt-5 pt-5'>
                    <h5 className="h3 mb-3 font-weight-normal">Instructor Schedule</h5> 
                    <form className="form-signin form-group">
                            {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}

                            <input type="email" onChange={(e) => setEmail(e.target.value)}   className="form-control" placeholder="Email address" required autoFocus></input>
                            <input type="text"  onChange={(e) => setPasscode(e.target.value)} className="form-control" placeholder="Password" required></input>
                            
                            <button className="btn btn-lg btn-primary btn-block" onClick={(e) => seeSchedule(e)} disabled={isLoading}>Check Schedule</button>
                            {/* <p className="mt-5 mb-3 text-muted">&copy; 2022</p>  */}
                        </form>

                </div>
                </div>
                      }
            </>
  )
}
