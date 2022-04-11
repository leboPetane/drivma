import { useState, useEffect } from "react";
import { Cookies } from "react-cookie";

export const Dashboard = ({instruct, logout}) => {

  useEffect(() => {
    let cookie =  new Cookies();
    if(cookie.get("userId") === undefined || cookie.get("UserLoggedIn") === undefined) logout();
    const getInstructors = async () => {
      let cookie =  new Cookies();
      const instrucs = await getInstructorsFromServer(cookie.get("userId"));
      if(instrucs) setInstructors(instrucs);
    }

    if (typeof(instruct) === 'object') getInstructors();
    else setInstructors(instruct);
  }, [])

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
  /* useStates ============================================*/
  const [instructors, setInstructors] = useState([])

  const [schedules, setSchedules] = useState([])

  const [newInstructor, setNewInstructor] = useState(false)

  //const [focusInstructor, setFocusInstructor] = useState([false, {}])
  const [focusInstructor, setFocusInstructor] = useState(false)

  const [instructorId, setInstructorId]   = useState(0);
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [mobileNumber, setMobileNumber]   = useState("");
  const [emailAddress, setEmailAddress]   = useState("");
  const [instructorPasscode, setPasscode] = useState("");
  const [instructorAddress, setAddress]   = useState("");
  const [instructorArea, setArea]         = useState("");
  const [errMsg, setErrMsg]               = useState("");
  const [trainingCar, setTrainingCar]     = useState("");
  const [isLoading, setIsLoading]         = useState(false);

  /* functions ============================================*/
  const toggleFocus = (id) => {
    setIsLoading(false);
    if (focusInstructor){
      if (instructorId === id){
        setFocusInstructor(false);
        setNewInstructor(false);
        setInstructorId(0);
        setFirstName("");
        setLastName("");
        setMobileNumber("");
        setPasscode("");
        setEmailAddress("");
        setArea("");
        setAddress("");
        setTrainingCar("")
        return;
      }
    }

    getLessonsFromServer(id);
    setFocusInstructor(true);
    
    var instr = instructors.filter((obj) => obj._id === id)[0];
    setInstructorId(instr._id);
    setFirstName(instr.first_name);
    setLastName(instr.last_name);
    setMobileNumber(instr.mobile);
    setPasscode(instr.passcode);
    setEmailAddress(instr.email);
    setArea(instr.area);
    setAddress(instr.address);
    setTrainingCar(instr.training_car)

    setNewInstructor(false);
  }

  const getLessonsFromServer = async (id) => {
    const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/lessons`, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
      }
    });

    const dt = new Date();
    const dtString = dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear();

    const data = await res.json();

    //console.log(data.filter((obj) => obj.instructor_id === id), dtString);
    const lessonsFromServer = data.filter((obj) => obj.instructor_id === id && dtString === obj.date);

    setSchedules(lessonsFromServer);
  }
  const addTrainer = () => {
    setFocusInstructor(!focusInstructor);
    setNewInstructor(true);

    setInstructorId(0);
    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setPasscode("");
    setEmailAddress("");
    setArea("");
    setAddress("");
    setTrainingCar("");
  }

  const saveInstructor = async (id) => {
    setIsLoading(true);
    let cookie = new Cookies
    var myObj = {
      first_name: firstName,
      last_name: lastName,
      mobile: mobileNumber,
      email: emailAddress,
      passcode: instructorPasscode,
      area: instructorArea,
      address: instructorAddress,
      driving_school_id: cookie.get("userId"),
      training_car: "",
      training_car_id: ""
    };

    if (id === 0){
      //save
      if ( firstName === "" || lastName === "" || mobileNumber === "" || emailAddress === "" || instructorPasscode === "" || instructorArea === "" || instructorAddress === "" ){ 
        setErrMsg("All fields are required.");
        return;
      }
      
      let res = null;
      let data = null;

      res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors`, {
          method: 'GET',
          headers: {
              'Content-type': 'application/json',
              'Accept': 'application/json'
          }
      });
      data = await res.json();

      const user = data.filter((obj) => obj.email === emailAddress)[0];

      if (!user){ 
        //console.log("not a duplicate so i can just go ahead...")
        res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors/`, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(myObj)
        });
      }else{
        setErrMsg("Email Address Has Already Been Used.");
        setIsLoading(false);
        return;
      }

      var mycookie = new Cookies();
      var inst = await getInstructorsFromServer(mycookie.get("userId"));
      setInstructors(inst);
      setIsLoading(false);
      setFocusInstructor(false);
      return;
    }

    

    const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors/${id}`, {
      method: 'PUT',
      headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify(myObj)
    });
    
    setFocusInstructor(false);
    setNewInstructor(false);

  }

    return (
        <>
        
        <div className = "row">
          
          {(focusInstructor && !newInstructor) &&
            <div className = "col-md-4">
                <div className="card card-user">
                <div className="image">
                    
                </div>
                <div className="card-body">
                    <div className="author">
                    <a href="#">
                        <h5 className="title">{firstName + " " + lastName}</h5>
                    </a>
                    <p className="description">
                    {instructorArea}  
                    </p>
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
                </div>
                
                </div>
            </div>}
          
            <div className={(focusInstructor && !newInstructor) ? "col-md-8" : "col-md-12"}>
              <div className="card">
             <div className="table-responsive">

             <div className="p-5">
              <button className="btn btn-primary btn-round" onClick={() => addTrainer()}>+ Toggle Add Trainer</button>
              <p className='m-0 p-0 text-info text-center'>Your instructor can use their email and passcode to check their daily schedule by visiting {window.location.href + "myschedule"}</p>

               </div>
                 <table className="table">
                    <thead className=" text-primary">
                        <tr>
                             <th> Name </th>
                             <th> area </th>
                             <th> Mobile </th>
                             <th> Training Car </th>
                             <th>  </th>
                        </tr>
                     </thead>
                     <tbody>
                       {instructors.length > 0 &&
                       instructors.map((inst) => 
                         <tr key={inst._id}>
                           <td> {inst.first_name + " " + inst.last_name} </td>
                           <td> {inst.area}   </td>
                           <td> {inst.mobile} </td>
                           <td> {inst.training_car}    </td>
                           <td> 
                               <button className="btn btn-sm btn-outline-success btn-round btn-icon" onClick={() => toggleFocus(inst._id)}><i className="nc-icon nc-settings-gear-65"></i></button>
                           </td>
                         </tr>
                       )
                      }
                     </tbody>
                 </table>
             </div>
         </div>
         {focusInstructor &&
            <div className="card card-user">
              <div className="card-header">
                <h5 className="card-title">{(focusInstructor && !newInstructor) ? "Edit Profile" : "Add Instructor"}</h5>
                {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-4 pr-1">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="text" className="form-control" disabled="" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}></input>
                      </div>
                    </div>
                    <div className="col-md-4 px-1">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}></input>
                      </div>
                    </div>
                    <div className="col-md-4 pl-1">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Passcode</label>
                        <input type="email" className="form-control" value={instructorPasscode} onChange={(e) => setPasscode(e.target.value)}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                      </div>
                    </div>
                    <div className="col-md-6 pl-1">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-12">
                      <div className="form-group">
                        <label>Training Car</label>
                        <input type="text" className="form-control" disabled value={trainingCar} onChange={(e) => setTrainingCar(e.target.value)}></input>
                      </div>

                    </div>
                    <div className="col-md-12 pr-1">
                      <div className="form-group">
                        <label>Area</label>
                        <input type="text" className="form-control" value={instructorArea} onChange={(e) => setArea(e.target.value)}></input>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" value={instructorAddress} onChange={(e) => setAddress(e.target.value)}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="update ml-auto mr-auto">
                      <button type="submit" className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault();saveInstructor(instructorId)} } disabled={isLoading}>Save Profile</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>}
          </div>
        </div>
     
        </>
    )
}
