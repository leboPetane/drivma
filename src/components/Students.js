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
        const res  = await fetch(`http://localhost:3000/api/instructors`, {
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
        const res  = await fetch(`http://localhost:3000/api/learners`, {
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
    const [isLoading,           setIsLoading] = useState(false)
        
    const removeLearner = async (id) => {
        const res  = await fetch(`http://localhost:3000/api/learners/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (res.status === 200){
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
        setIsLoading(false);
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
        setIsLoading(true);

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
        
        let res  = await fetch(`http://localhost:3000/api/learners${endpoint}`, {
            method: (id === "" ? 'POST' : 'PUT'),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(myObj)
        });
        setIsLoading(false);

        if (res.status === 200){
            setMemberForm(false);
            const updatedLearners = await getLearnersFromServer(myCookie.get("userId"));

            setLearners(updatedLearners);

        }else{
            setErrMsg("Error saving car: " + res.status + " | " + res.statusText);
        }
    }

    return (
        <div className="content-section">
            <div className="d-flex justify-between align-center mb-6">
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                    👨‍🎓 Student Management
                </h3>
                <button
                    className="btn btn-primary"
                    onClick={addCar}
                >
                    <span>➕</span>
                    <span>Add Student</span>
                </button>
            </div>

            {learners.length > 0 ? (
                <div className="table-responsive">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Contact Info</th>
                                <th>Address</th>
                                <th>Area</th>
                                <th>Instructor</th>
                                <th>Test Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learners.map((learner) => (
                                <tr key={learner._id}>
                                    <td>
                                        <div style={{ display: 'flex', align: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontSize: '1.2rem' }}>👨‍🎓</span>
                                            <div>
                                                <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                                                    {learner.first_name} {learner.last_name}
                                                </div>
                                                {learner.car_name && (
                                                    <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                        🚗 {learner.car_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                                                📧 {learner.email}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
                                                📱 {learner.mobile}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 'var(--font-size-sm)', maxWidth: '200px', wordBreak: 'break-word' }}>
                                            📍 {learner.address}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{learner.area}</span>
                                    </td>
                                    <td>
                                        {learner.driver_name ? (
                                            <div>
                                                <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                                                    👨‍🏫 {learner.driver_name}
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Not assigned</span>
                                        )}
                                    </td>
                                    <td>
                                        {learner.test_date ? (
                                            <span className={`badge ${isTestDateSoon(learner.test_date) ? 'badge-warning' : 'badge-success'}`}>
                                                📅 {learner.test_date}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => focusLearner(learner._id)}
                                                title="Edit student"
                                            >
                                                ⚙️
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to remove ${learner.first_name} ${learner.last_name}?`)) {
                                                        removeLearner(learner._id);
                                                    }
                                                }}
                                                title="Remove student"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👨‍🎓</div>
                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                        No students enrolled yet
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                        Add your first student to start managing their driving lessons and progress.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={addCar}
                    >
                        <span>➕</span>
                        <span>Add First Student</span>
                    </button>
                </div>
            )}

            {/* Student Form */}
            {memberForm && (
                <div className="content-section" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                {focusedLearner ? 'Edit Student' : 'Add New Student'}
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
                                    <div className="form-group">
                                        <label className="form-label">Area</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            placeholder="Service area"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Mobile Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            placeholder="Mobile number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Full address"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Assign to Instructor</label>
                                        <select
                                            className="form-control"
                                            value={instructor}
                                            onChange={(e) => setInstructor(e.target.value)}
                                            required
                                        >
                                            <option value="0">Select Instructor</option>
                                            {instructors.map((instructor) => (
                                                <option key={instructor._id} value={instructor._id}>
                                                    {instructor.first_name} {instructor.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Test Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={testDate}
                                            onChange={(e) => setTestDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setMemberForm(false);
                                            setFocusedLearner("");
                                            setFirstName("");
                                            setLastName("");
                                            setAddress("");
                                            setArea("");
                                            setMobile("");
                                            setEmail("");
                                            setCar("");
                                            setInstructor("");
                                            setTestDate("");
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
                                            saveLearner(focusedLearner);
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="btn-loading"></span> : (focusedLearner ? 'Update Student' : 'Add Student')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Statistics */}
            {learners.length > 0 && (
                <div className="content-section" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="stats-grid">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>👨‍🎓</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {learners.length}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Total Students
                                </p>
                            </div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>👨‍🏫</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {new Set(learners.map(l => l.instructor_id)).size}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Active Instructors
                                </p>
                            </div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📅</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {learners.filter(learner => isTestDateSoon(learner.test_date)).length}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Tests Soon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    // Helper function to check if test date is within 14 days
    function isTestDateSoon(testDate) {
        if (!testDate) return false;

        try {
            const test = new Date(testDate);
            const today = new Date();
            const fourteenDaysFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));

            return test <= fourteenDaysFromNow && test >= today;
        } catch (error) {
            return false;
        }
    }
}
