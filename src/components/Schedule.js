import React from 'react'
import { useState, useEffect } from 'react'
import { Cookies } from 'react-cookie'

export const Schedule = ({logout}) => {
    const [focusedInstructor, setFocusInstructor]   = useState("0")
    const [focusedLearner,    setFocusedLearner]    = useState("0")
    const [nextWeekDate,      setNextWeekDate]      = useState(new Date())
    const [nextWeekDateStr,   setNextWeekDateStr]   = useState(nextWeekDate.toDateString())
    const [weekDates,         setWeekDays]          = useState([])
    const [instructors,       setInstructors]       = useState([])
    const [learners,          setLearners]          = useState([])
    const [schedule,          setSchedule]          = useState([])
    const [instructorLessons, setInstructorLessons] = useState([])

    useEffect(() => {
        let cookie =  new Cookies();
        if(cookie.get("userId") === undefined || cookie.get("UserLoggedIn") === undefined) logout();

        const getInstructors = async () => {
            let cookie =  new Cookies();
            await getInstructorsFromServer(cookie.get("userId"));
        }
    
        getInstructors();
        instructorFilter("-1");
        if (focusedInstructor === "0") setWeeklyDates(new Date());
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
        setInstructors(instrucs);
        //return instrucs;

    }

    const setWeeklyDates = (dt) => {
        /* Make sure we start on a sunday */
        var dates = [1,2,3,4,5,6,7];
        if (dt.getDay() > 0){
            dt.setDate(dt.getDate() - dt.getDay());
        }
    
        var newDt = new Date()
        for(var i in dates) {
            dates[i] = {
                            id:i,
                            day: dt.getDay(),
                            date: dt.getDate(),
                            month: dt.getMonth(),
                            year: dt.getFullYear(),
                            bookable: (dt.getTime() > newDt.getTime())
                       }
            dt.setDate(dt.getDate() + 1);
        }

        setWeekDays(dates)
        setNextWeekDate(dt);
        setNextWeekDateStr(dt.toDateString());
        //instructorFilter(focusedInstructor);
    }

    const onNext = () => {
        setWeeklyDates(nextWeekDate);

    }

    const onPrev = () => {
        var dt1 = new Date(nextWeekDate);
        var dt  = new Date(dt1.setDate(dt1.getDate() - 14));
        setWeeklyDates(new Date(dt));
    }

    const bookAppointment = async (day, month, year, time) => {
        const tempDate = new Date();
        if (year === tempDate.getFullYear() && month === tempDate.getMonth() && day === tempDate.getDate() && parseFloat(time.substring(0,2)) < tempDate.getHours()){
            alert(`The time is ${tempDate.getHours() + ':' + tempDate.getMinutes()} Cannot book appointment for ${time} today.`);
            return;
        }

        if (focusedInstructor === "0"){
            alert("Please select instructor you would like to book for.");
            return;
        }
        if (focusedLearner === "0"){
            alert("Please select the learner you would like to book for.")
            return;
        }

        var theeLearner = learners.filter((obj) => obj._id === focusedLearner)[0];
        var theeInstruc = instructors.filter((obj) => obj._id === focusedInstructor)[0];
        var daysStr = ["sunday","monday", "tueday", "wednesday", "thursday", "friday", "saturday"];
        var myObj = {
            learner_id: focusedLearner,
            instructor_id: focusedInstructor,
            date: day+"/"+month+"/"+year,
            time: time.substring(0,2),
            area: theeLearner.area,
            learner: theeLearner.first_name + " " + theeLearner.last_name,
            day:(daysStr[(new Date((month+1)+"/"+day+"/"+year)).getDay()]),
            instructor: theeInstruc.first_name + " " + theeInstruc.last_name
        }

        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/lessons/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(myObj)
        });
        console.log(res.status);
        learnerFilter(focusedLearner);
        alert("Appointment booked for: " + day+"/"+month+"/"+year+"@"+time+ " | " + theeLearner.first_name + " " + theeLearner.last_name);

    }

    const instructorFilter = async (id) =>{

        if (id === "-1"){
            setSchedule([]);
            setInstructorLessons([]);
            setLearners([]);
            return;
        }

        setFocusInstructor(id);
        if (instructors.length === 0){
            let myCookie = new Cookies()
            getInstructorsFromServer(myCookie.get("userId"));
        }

        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/learners`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data        = await res.json();
        const theLearners = data.filter((obj) => obj.instructor_id === id);

        setLearners(theLearners);

        var timesArr = {
            "07":[[],[],[],[],[],[],[]],
            "08":[[],[],[],[],[],[],[]],
            "09":[[],[],[],[],[],[],[]],
            "10":[[],[],[],[],[],[],[]],
            "11":[[],[],[],[],[],[],[]],
            "12":[[],[],[],[],[],[],[]],
            "13":[[],[],[],[],[],[],[]],
            "14":[[],[],[],[],[],[],[]],
            "15":[[],[],[],[],[],[],[]],
            "16":[[],[],[],[],[],[],[]],
            "17":[[],[],[],[],[],[],[]],
            "18":[[],[],[],[],[],[],[]],
            "19":[[],[],[],[],[],[],[]]
        }
        let timeRange = ["07","08","09","10","11","12","13","14","15","16","17","18","19"];
        let filteredSchedule = [];
        timeRange.forEach((timeStamp) => {
            let tempLesson = {
                time:timeStamp + ":00",
                sunday:    timesArr[timeStamp][0],
                monday:    timesArr[timeStamp][1],
                tuesday:   timesArr[timeStamp][2],
                wednesday: timesArr[timeStamp][3],
                thursday:  timesArr[timeStamp][4],
                friday:    timesArr[timeStamp][5],
                saturday:  timesArr[timeStamp][6]
            }
            filteredSchedule.push(tempLesson);
        });

        setSchedule(filteredSchedule);
        getLessons(id, "0");

    }

    const getCurrentLesson = (iTime, cDate) => {

        let reqLesson = null;
            reqLesson = instructorLessons.filter((obj) => (iTime === obj.time && cDate === obj.date));

        
        if (reqLesson === null || reqLesson === undefined || reqLesson.length === 0) return false;
        return (reqLesson.length === 0 ? false : reqLesson);
    }

    const getLessons = async (id, learnerId) => {
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/lessons`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data       = await res.json();
        let instructorsArr = [];

        instructors.forEach((obj) => {
            instructorsArr.push(obj._id)
        });

        let theLessons   = (id === "0" ? data.filter((obj) => instructorsArr.indexOf(obj.instructor_id) >= 0) : data.filter((obj) => obj.instructor_id === id));
        setInstructorLessons(theLessons);

    }

    const learnerFilter = async (id) =>{
        getLessons(focusedInstructor, id);
        setFocusedLearner(id);
    }

    
 
    return (
        <div>
            <div className='card p-2'>
                <b className='pr-5 mr-3'>Book For:</b> 
                <div className='d-flex p-3'>
                    
                    <select className="form-group form-control mr-2" onChange={(e) => instructorFilter(e.target.value)} disabled={!(instructors.length > 0)}>
                        <option value="-1">{"<Select Instructor>"}</option>
                        <option value="0">All Instructors</option>
                        {instructors.length > 0 && instructors.map((instr) => <option key={instr._id} value={instr._id}>{instr.first_name + " " + instr.last_name}</option>)}
                    </select>
                    <select className="form-group form-control" onChange={(e) => learnerFilter(e.target.value)} disabled={!(learners.length > 0)}>
                        <option value="0">{"<Select Student>"}</option>
                        {learners.length > 0 && learners.map((learnerInp) => <option key={learnerInp._id} value={learnerInp._id}>{learnerInp.first_name + " " + learnerInp.last_name}</option>)}
                    </select>
            </div>
            
            
            </div>

            <div className="card">
                <div className="card-header">
                    <button className="btn btn-info" onClick={onPrev}>prev</button>
                    <button className="btn btn-info" onClick={onNext}>next</button>
                </div>
                <div className="card-body table-responsive">
                    <table className="table">
                        <thead className=" text-primary text-center">
                            <tr>
                                    <th> {nextWeekDateStr.split(" ")[1] + " " + nextWeekDateStr.split(" ")[3]} </th>
                                    {weekDates.map(wkday => 
                                    <th key={wkday.id} className={((new Date()).getDate() === wkday.date && (new Date).getMonth() === wkday.month ? "bg-secondary" : "")}>
                                        {(wkday.day === 0 ? "SUN" : 
                                            wkday.day === 1 ? "MON" : 
                                            wkday.day === 2 ? "TUE" : 
                                            wkday.day === 3 ? "WED" : 
                                            wkday.day === 4 ? "THUR":
                                            wkday.day === 5 ? "FRI" : "SAT")}
                                        <div className='text-center'>{wkday.date}</div>
                                    </th>)}
                                    
                            </tr>
                            </thead>
                            <tbody>
                                {schedule.map(item => 
                                    <tr key={Math.random() * 3546120 }>
                                        <th> {item.time}    </th>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[0].date+"/"+weekDates[0].month+"/"+weekDates[0].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[0].date+"/"+weekDates[0].month+"/"+weekDates[0].year).map((obj) => <p key={obj._id}>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>) }
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[0].date+"/"+weekDates[0].month+"/"+weekDates[0].year) === false && 
                                                <button disabled={!weekDates[0].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[0].date,weekDates[0].month,weekDates[0].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[1].date+"/"+weekDates[1].month+"/"+weekDates[1].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[1].date+"/"+weekDates[1].month+"/"+weekDates[1].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[1].date+"/"+weekDates[1].month+"/"+weekDates[1].year) === false && 
                                                <button disabled={!weekDates[1].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[1].date,weekDates[1].month,weekDates[1].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[2].date+"/"+weekDates[2].month+"/"+weekDates[2].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[2].date+"/"+weekDates[2].month+"/"+weekDates[2].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[2].date+"/"+weekDates[2].month+"/"+weekDates[2].year) === false && 
                                                <button disabled={!weekDates[2].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[2].date,weekDates[2].month,weekDates[2].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[3].date+"/"+weekDates[3].month+"/"+weekDates[3].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[3].date+"/"+weekDates[3].month+"/"+weekDates[3].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[3].date+"/"+weekDates[3].month+"/"+weekDates[3].year) === false && 
                                                <button disabled={!weekDates[3].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[3].date,weekDates[3].month,weekDates[3].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[4].date+"/"+weekDates[4].month+"/"+weekDates[4].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[4].date+"/"+weekDates[4].month+"/"+weekDates[4].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[4].date+"/"+weekDates[4].month+"/"+weekDates[4].year) === false && 
                                                <button disabled={!weekDates[4].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[4].date,weekDates[4].month,weekDates[4].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[5].date+"/"+weekDates[5].month+"/"+weekDates[5].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[5].date+"/"+weekDates[5].month+"/"+weekDates[5].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[5].date+"/"+weekDates[5].month+"/"+weekDates[5].year) === false && 
                                                <button disabled={!weekDates[5].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[5].date,weekDates[5].month,weekDates[5].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[6].date+"/"+weekDates[6].month+"/"+weekDates[6].year) && 
                                                getCurrentLesson(item.time.substring(0,2),weekDates[6].date+"/"+weekDates[6].month+"/"+weekDates[6].year).map((obj) => <p>Lesson with {obj.learner} <br></br> <span className='badge badge-warning'>{obj.instructor} </span></p>)} 
                                            {getCurrentLesson(item.time.substring(0,2),weekDates[6].date+"/"+weekDates[6].month+"/"+weekDates[6].year) === false && 
                                                <button disabled={!weekDates[6].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[6].date,weekDates[6].month,weekDates[6].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        
                                    </tr>
                                )}
                        </tbody>
                      </table>
                </div>
            </div>
        </div>
    )
}
