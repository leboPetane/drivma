import { useState, useEffect } from "react";
import { Cookies } from "react-cookie";

export const Dashboard = ({instruct, logout}) => {
  
  let REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  REACT_APP_API_URL  = (REACT_APP_API_URL == "" ? "http://localhost:3000" : REACT_APP_API_URL);
  
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
    const res  = await fetch(`http://localhost:3000/api/instructors`, {
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
    const res  = await fetch(`http://localhost:3000/api/lessons`, {
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

      res  = await fetch(`http://localhost:3000/api/instructors`, {
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
        res  = await fetch(`http://localhost:3000/api/instructors/`, {
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

    

    const res  = await fetch(`http://localhost:3000/api/instructors/${id}`, {
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
        <div className="content-section">
          <div className="content-grid">
            {/* Instructor Details Sidebar */}
            {(focusInstructor && !newInstructor) && (
              <div className="content-section">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{firstName} {lastName}</h3>
                    <p className="text-muted" style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-sm)' }}>
                      📍 {instructorArea}
                    </p>
                  </div>
                  <div className="card-body">
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
                      Today's Schedule
                    </h4>
                    {schedules.length > 0 ? (
                      <div className="space-y-2">
                        {schedules.map((lesson) => (
                          <div key={lesson._id} className="d-flex align-center justify-between p-3" style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-sm)' }}>
                            <div>
                              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                                {lesson.time}:00
                              </div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', marginTop: 'var(--space-1)' }}>
                                Lesson with {lesson.learner}
                              </div>
                            </div>
                            <span className="badge badge-warning">{lesson.area}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-4)' }}>
                        No lessons scheduled for today
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Instructor List */}
            <div>
              <div className="content-section">
                <div className="d-flex justify-between align-center mb-4">
                  <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                    Instructors
                  </h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => addTrainer()}
                  >
                    <span>➕</span>
                    <span>Add Instructor</span>
                  </button>
                </div>

                <div style={{ background: 'var(--color-info)', border: '1px solid var(--color-primary)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
                    <strong>Instructor Portal:</strong> Instructors can check their daily schedule at {window.location.href}myschedule using their email and passcode.
                  </p>
                </div>

                {instructors.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Area</th>
                          <th>Mobile</th>
                          <th>Training Car</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructors.map((inst) => (
                          <tr key={inst._id}>
                            <td>
                              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                                {inst.first_name} {inst.last_name}
                              </div>
                            </td>
                            <td>{inst.area}</td>
                            <td>{inst.mobile}</td>
                            <td>
                              {inst.training_car ? (
                                <span className="badge badge-secondary">{inst.training_car}</span>
                              ) : (
                                <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Not assigned</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => toggleFocus(inst._id)}
                                title="Edit instructor"
                              >
                                ⚙️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👥</div>
                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                      No instructors yet
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                      Add your first instructor to get started with managing your driving school.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => addTrainer()}
                    >
                      <span>➕</span>
                      <span>Add First Instructor</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Instructor Form */}
              {focusInstructor && (
                <div className="content-section" style={{ marginTop: 'var(--space-6)' }}>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">
                        {newInstructor ? 'Add New Instructor' : 'Edit Instructor Profile'}
                      </h3>
                    </div>
                    <div className="card-body">
                      {errMsg && (
                        <div className="alert alert-error">
                          {errMsg}
                        </div>
                      )}

                      <form>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First name"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last name"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              placeholder="Email address"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              placeholder="Mobile number"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Passcode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={instructorPasscode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Instructor passcode"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Area</label>
                          <input
                            type="text"
                            className="form-control"
                            value={instructorArea}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="Service area"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={instructorAddress}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Full address"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Training Car</label>
                          <input
                            type="text"
                            className="form-control"
                            value={trainingCar}
                            onChange={(e) => setTrainingCar(e.target.value)}
                            placeholder="Assigned training car"
                            disabled
                            style={{ background: 'var(--color-gray-50)' }}
                          />
                        </div>

                        <div className="d-flex gap-4 justify-end">
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                              setFocusInstructor(false);
                              setNewInstructor(false);
                              setErrMsg("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              saveInstructor(instructorId);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? <span className="btn-loading"></span> : (newInstructor ? 'Add Instructor' : 'Save Changes')}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    )
}
