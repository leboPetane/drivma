import React from 'react'
import { useState, useEffect } from 'react'
import { Cookies } from 'react-cookie'

export const Students = ({logout}) => {

    useEffect(() => {
        let cookie = new Cookies();
        if (cookie.get("userId") === undefined || cookie.get("UserLoggedIn") === undefined) logout();

        const getLearners = async () => {
            const learnersFromServer = await getLearnersFromServer(cookie.get("userId"));
            setLearners(learnersFromServer);
        }

        const getInstructors = async () => {
            let cookie =  new Cookies();
            const instrucs = await getInstructorsFromServer(cookie.get("userId"));
            setInstructors(instrucs);
          }

        getLearners();
        getInstructors();
    }, [])

    const getInstructorsFromServer = async (id) => {
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (res.status === 200){
            const data = await res.json();
            const instruc = data.filter((obj) => obj.driving_school_id === id);
            return instruc;
        }
        return [];
        
    }

    const getLearnersFromServer = async (id) => {
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/learners`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (res.status === 200){
            const data = await res.json();
            const students = data.filter((obj) => obj.driving_school_id === id);
            return students;
        }
        return [];
        
    }

    const [memberForm,         setMemberForm] = useState(false)
    const [focusedLearner, setFocusedLearner] = useState("");
    const [learners,             setLearners] = useState([])
    const [firstName,           setFirstName] = useState("")
    const [lastName,             setLastName] = useState("")
    const [address,               setAddress] = useState("")
    const [area,                     setArea] = useState("")
    const [mobile,                 setMobile] = useState("")
    const [email,                   setEmail] = useState("")
    const [car,                       setCar] = useState("")
    const [instructor,         setInstructor] = useState("")
    const [testDate,             setTestDate] = useState("")
    const [errMsg,                 setErrMsg] = useState("")
    const [instructors,       setInstructors] = useState([])
        
    const removeLearner = async (id) => {
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/learners/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (res.status == 200){
            const myCookie = new Cookies();
            setMemberForm(false);
            const updatedLearners = await getLearnersFromServer(myCookie.get("userId"));

            setLearners(updatedLearners);
        }else{
            console.log("Error deleting car: " + res.status + " | " + res.statusText);
        }
    }

    const addCar = () => {
        setErrMsg("");
        if (focusedLearner === "" && memberForm){
            setMemberForm(false);
            setFocusedLearner("");
            setFirstName("");
            setLastName("");
            setAddress("")
            setArea("");
            setMobile("");
            setEmail("");
            setCar("");
            setInstructor("");
            setTestDate("");
            return;
        }

        setMemberForm(true);
        setFocusedLearner("");
        setFirstName("");
        setLastName("");
        setAddress("")
        setArea("");
        setMobile("");
        setEmail("");
        setCar("");
        setInstructor("");
        setTestDate("");

    }

    const focusLearner = (id) => {
        if (focusedLearner === id && memberForm){
            setMemberForm(false);
            setFocusedLearner("");
            setFirstName("");
            setLastName("");
            setAddress("")
            setArea("");
            setMobile("");
            setEmail("");
            setCar("");
            setInstructor("");
            setTestDate("");
            return;
        }

        const theLearner  = learners.filter((obj) => obj._id === id)[0];
        setFocusedLearner(id);
        setFirstName(theLearner.first_name);
        setAddress(theLearner.address);
        setLastName(theLearner.last_name);
        setArea(theLearner.area);
        setAddress(theLearner.address);
        setMobile(theLearner.mobile);
        setEmail(theLearner.email);
        setCar(theLearner.car_name);
        setInstructor(theLearner.instructor_id);
        setTestDate(theLearner.test_date);
        setMemberForm(true);
        
    }

    const saveLearner = async (id) => {
        setErrMsg(""); 
        if (firstName === ""){
            setErrMsg("First name is required.");
            return;
        }
        if (lastName === ""){
            setErrMsg("Last name is required.");
            return;
        }
        if (address === ""){
            setErrMsg("Address is required.");
            return;
        }
        if (area === ""){
            setErrMsg("Area is required.");
            return;
        }
        if (mobile === ""){
            setErrMsg("Mobile number is required.");
            return;
        }
        if (email === ""){
            setErrMsg("Email address is required");
            return;
        }
        if (instructor === "0"){
            setErrMsg("Please Select Driving Instructor");
            return;
        }
        
        
        const myCookie      = new Cookies();
        let theChosenDriver = instructors.filter((obj) => obj._id === instructor)[0];

        const myObj = {
            instructor_id:instructor,
            first_name:firstName,
            last_name:lastName,
            email:email,
            mobile:mobile,
            training_car_id: theChosenDriver.training_car_id,
            test_date:testDate,
            area:area,
            address:address,
            car_name:theChosenDriver.training_car, 
            driver_name:theChosenDriver.first_name + " " + theChosenDriver.last_name,
            driving_school_id:myCookie.get("userId")
        }
        
        const endpoint = (id === "" ? "" : "/" + focusedLearner);
        
        let res  = await fetch(`${process.env.REACT_APP_API_URL}/api/learners${endpoint}`, {
            method: (id === "" ? 'POST' : 'PUT'),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(myObj)
        });

        if (res.status == 200){
            setMemberForm(false);
            const updatedLearners = await getLearnersFromServer(myCookie.get("userId"));

            setLearners(updatedLearners);

        }else{
            setErrMsg("Error saving car: " + res.status + " | " + res.statusText);
        }
    }

    return (
        <div>
            <div>
                <button className="btn btn-default btn-round" onClick={(e) => addCar()}>+ Add New</button>
            </div>
            <div className="table-responsive">
                <table className="table">
                   <thead className=" text-primary">
                       <tr>
                            <th> Name </th>
                            <th> Address </th>
                            <th> Area </th>
                            <th> Mobile </th>
                            <th> Email </th>
                            <th> Car </th>
                            <th> Instructor </th>
                            <th> Test Date </th>
                            <th>  </th>
                            <th>  </th>
                       </tr>
                    </thead>
                    <tbody>
                        {learners.map((learner) => 
                        <tr key={learner._id}>
                            <td> {learner.first_name + " " + learner.last_name} </td>
                            <td> {learner.address} </td>
                            <td> {learner.area} </td>
                            <td> {learner.mobile} </td>
                            <td> {learner.email} </td>
                            <td> {learner.car_name}</td>
                            <td> {learner.driver_name} </td>
                            <td> {learner.test_date} </td>
                            <td> <button className="btn btn-sm btn-outline-danger" onClick={() => removeLearner(learner._id)}>remove</button> </td>
                            <td> <button className="btn btn-sm btn-outline-success btn-round btn-icon " onClick={() => focusLearner(learner._id)} ><i className="nc-icon nc-settings-gear-65"></i></button> </td>
                        </tr>)}
                     
                    </tbody>
                </table>
            </div>
            {memberForm && 
            <div className = "row card">
                <div className="col-md-12">
                    {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}
                    <div className="card-body">
                    <form>
                        <div className="row">
                            <div className="col-md-4 pr-1">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" disabled="" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="col-md-4 px-1">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control"  value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="col-md-4 pl-1">
                                <div className="form-group">
                                    <label >Area</label>
                                    <input type="text" className="form-control" value={area} onChange={(e) => setArea(e.target.value)}></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 pr-1">
                                <div className="form-group">
                                    <label>Mobile</label>
                                    <input type="text" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="col-md-6 pl-1">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className='form-group'>
                                    <label>Address</label>
                                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Instructor</label>
                                    <select className="form-group form-control" value={instructor} onChange={(e) => setInstructor(e.target.value)}>
                                        <option value="0">
                                         {"<Select Instructor>"}
                                        </option>
                                        {instructors.map((obj) => <option key={obj._id} value={obj._id}>{obj.first_name + " " + obj.last_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Test Date</label>
                                    <input type="date" className="form-control" value={testDate} onChange={(e) => setTestDate(e.target.value)}></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                                <div className="update ml-auto mr-auto">
                                <button type="submit" className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault(); saveLearner(focusedLearner)}}>Save Learner</button>
                                </div>
                         </div>
                        </form>
                    </div>
                </div>
            </div> }
        </div>
    )
}
