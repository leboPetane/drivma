import { useState, useEffect } from "react";

export const Dashboard = () => {

  /* useEffect 
  useEffect(() => {
    const getInstructors = async () => {
      const instructorsFromServer = await fetchInstructors()
      setInstructors(instructorsFromServer)
    }

    getInstructors()
  }, [])

  const fetchInstructors = async () => {
    const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/bibleTeacher`) 
    const data = await res.json()

    return data
  }*/

  /* useStates ============================================*/
    const [instructors, setInstructors] = useState([
      {
        id:1,
        first_name: "Dokata",
        last_name: "Rice",
        passcode: "heAndSheDekota2021",
        address: "1 Main Road, Woodbridge, Milnerton, 7441",
        city: "Milnerton",
        mobile: "0731234567",
        car: "Tata Indica"
      },
      {
        id:2,
        first_name: "Rich",
        last_name: "Charlie",
        email:"rich.charlie@gmail.com",
        passcode: "rich2021",
        address: "1 Main Road, Goodwood, Milnerton, 7441",
        city: "Goodwood",
        mobile: "0731234567",
        car: "Tata Indica"
      }
    ])

    const [schedules, setSchedules] = useState([
      {
        id:1,
        time: "07:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:2,
        time: "08:00",
        booked: false,
        learner: "",
        city: ""
      },
      {
        id:3,
        time: "09:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:4,
        time: "10:00",
        booked: false,
        learner: "",
        city: ""
      },
      {
        id:5,
        time: "11:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:6,
        time: "12:00",
        booked: false,
        learner: "",
        city: ""
      },
      {
        id:7,
        time: "13:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:8,
        time: "14:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:9,
        time: "15:00",
        booked: false,
        learner: "",
        city: ""
      },
      {
        id:10,
        time: "16:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:11,
        time: "17:00",
        booked: false,
        learner: "",
        city: ""
      },
      {
        id:12,
        time: "18:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      },
      {
        id:13,
        time: "19:00",
        booked: true,
        learner: "Jeremy",
        city: "Belhar"
      }

    ])

    const [newInstructor, setNewInstructor] = useState(false)

    const [focusInstructor, setFocusInstructor] = useState([false, 
      {
        id:1,
        first_name: "Dokata",
        last_name: "Rice",
        email:"dekotal.rice@gmail.com",
        passcode: "heAndSheDekota2021",
        address: "1 Main Road, Woodbridge, Milnerton, 7441",
        city: "Milnerton",
        mobile: "0731234567",
        car: "Tata Indica"
      }
  ])

  const [cars, setCars] = useState(["Tata Indica", "Huday i20", "Polo Vivo"])

  /* functions ============================================*/
  const toggleFocus = (id) => {
    if (focusInstructor[0] === true){
      if (focusInstructor[1].id === id){
        setFocusInstructor([false, {}]);
        setNewInstructor(false);
        return;
      }
    }

    setFocusInstructor([true,instructors.filter((inst) => inst.id == id)[0]]);
    setNewInstructor(false);
  }

  const addTrainer = () => {
    setFocusInstructor([!newInstructor, 
      {
        id:0,
        first_name: "",
        last_name: "",
        email:"",
        passcode: "",
        address: "",
        city: "",
        mobile: "",
        car: ""
      }
    ]);

    setNewInstructor(!newInstructor);
  }

  const saveInstructor = (id) => {
    
    if (id == 0){
      //save
      console.log("Ai this one is new na")
      setFocusInstructor([false, {}]);
      return;
    }
    var myObj = {};
    var newArr = instructors.filter((obj) => obj.id !== id);
    newArr.push(myObj);
    console.log(newArr);
    //set
    setFocusInstructor([false, {}]);
    setNewInstructor(false);

  }

  const addSchedule = (id) => {
    var lesson     = schedules.filter((l) => l.id == id)[0];
    var newLessons = schedules.filter((obj) => obj.lesson.id !== id);
    
    const learner = window.prompt("Enter the name of the student");
  }

    return (
        <>
        
        
        <div className = "row">
          {(focusInstructor[0] && !newInstructor) &&
            <div className = "col-md-4">
                <div className="card card-user">
                <div className="image">
                    
                </div>
                <div className="card-body">
                    <div className="author">
                    <a href="#">
                        <h5 className="title">{focusInstructor[1].first_name + " " + focusInstructor[1].last_name}</h5>
                    </a>
                    <p className="description">
                    {focusInstructor[1].city}  
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
                        <tr key={lesson.id}>
                          <th> {lesson.time} </th>
                          <td>  {lesson.booked ? <p> Lesson with {lesson.learner} <span className='badge badge-warning'> {lesson.city} </span></p> : ""}  </td>
                          {/* <td> {lesson.booked ? 
                                "" : 
                                <button className="btn btn-sm btn-outline-success btn-round" onClick={() => addSchedule(lesson.id)}>add</button>}
                              
                          </td> */}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <div className="card-footer">
                    <div className="button-container">
                    <p>
                        <a className="btn btn-primary btn-sm mr-1">Today</a>
                        <a className="btn btn-primary btn-sm mr-1">Next</a>
                    </p>
                    </div>
                </div> */}
                </div>
            </div>}
          
            <div className={(focusInstructor[0] && !newInstructor) ? "col-md-8" : "col-md-12"}>
              <div className="card">
             <div className="table-responsive">

             <div className="p-5">
              <button className="btn btn-primary btn-round" onClick={() => addTrainer()}>+ Toggle Add Trainer</button>

               </div>
                 <table className="table">
                    <thead className=" text-primary">
                        <tr>
                             <th> Name </th>
                             <th> City </th>
                             <th> Mobile </th>
                             <th> Training Car </th>
                             <th>  </th>
                        </tr>
                     </thead>
                     <tbody>
                       {instructors.map((inst) => 
                         <tr key={inst.id}>
                           <td> {inst.first_name + " " + inst.last_name} </td>
                           <td> {inst.city}   </td>
                           <td> {inst.mobile} </td>
                           <td> {inst.car}    </td>
                           <td> 
                               <button className="btn btn-sm btn-outline-success btn-round btn-icon" onClick={() => toggleFocus(inst.id)}><i className="nc-icon nc-settings-gear-65"></i></button>
                           </td>
                         </tr>
                       )}
                     </tbody>
                 </table>
             </div>
         </div>
         {focusInstructor[0] &&
            <div className="card card-user">
              <div className="card-header">
                <h5 className="card-title">Edit Profile</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-4 pr-1">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="text" className="form-control" disabled="" value={focusInstructor[1].mobile}></input>
                      </div>
                    </div>
                    <div className="col-md-4 px-1">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" value={focusInstructor[1].email}></input>
                      </div>
                    </div>
                    <div className="col-md-4 pl-1">
                      <div className="form-group">
                        <label for="exampleInputEmail1">Passcode</label>
                        <input type="email" className="form-control" value={focusInstructor[1].passcode}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={focusInstructor[1].first_name}></input>
                      </div>
                    </div>
                    <div className="col-md-6 pl-1">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" value={focusInstructor[1].last_name}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-12">
                      <div className="form-group">
                        <label>Training Car</label>
                        <select className="form-group form-control">
                          {cars.map((car) => <option key={Math.random()*234.62}>
                                {car}
                            </option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" value={focusInstructor[1].address}></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="update ml-auto mr-auto">
                      <button type="submit" className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault();saveInstructor(focusInstructor[1].id)} }>Save Profile</button>
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
