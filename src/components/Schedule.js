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
        const res  = await fetch(`http://localhost:3000/api/instructors`, {
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

        const res  = await fetch(`http://localhost:3000/api/lessons/`, {
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

        const res  = await fetch(`http://localhost:3000/api/learners`, {
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
        const res  = await fetch(`http://localhost:3000/api/lessons`, {
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
        <div className="content-section">
            <div className="d-flex justify-between align-center mb-6">
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                    📅 Schedule Management
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        className="btn btn-outline"
                        onClick={onPrev}
                    >
                        ← Previous Week
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={onNext}
                    >
                        Next Week →
                    </button>
                </div>
            </div>

            {/* Booking Controls */}
            <div className="content-section" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
                            👨‍🏫 Select Instructor
                        </label>
                        <select
                            className="form-control"
                            onChange={(e) => instructorFilter(e.target.value)}
                            disabled={!(instructors.length > 0)}
                            style={{ width: '100%' }}
                        >
                            <option value="-1">Select Instructor</option>
                            <option value="0">All Instructors</option>
                            {instructors.length > 0 && instructors.map((instr) => (
                                <option key={instr._id} value={instr._id}>
                                    {instr.first_name} {instr.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
                            👨‍🎓 Select Student
                        </label>
                        <select
                            className="form-control"
                            onChange={(e) => learnerFilter(e.target.value)}
                            disabled={!(learners.length > 0)}
                            style={{ width: '100%' }}
                        >
                            <option value="0">Select Student</option>
                            {learners.length > 0 && learners.map((learnerInp) => (
                                <option key={learnerInp._id} value={learnerInp._id}>
                                    {learnerInp.first_name} {learnerInp.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {focusedInstructor === "0" && (
                    <div style={{ background: 'var(--color-info)', border: '1px solid var(--color-primary)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
                            <strong>💡 Tip:</strong> Select an instructor to view their weekly schedule and book lessons.
                        </p>
                    </div>
                )}

                {focusedInstructor !== "0" && focusedLearner === "0" && (
                    <div style={{ background: 'var(--color-warning)', border: '1px solid var(--color-warning)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>
                            <strong>⚠️ Note:</strong> Select a student to enable lesson booking.
                        </p>
                    </div>
                )}
            </div>

            {/* Schedule Grid */}
            {schedule.length > 0 && weekDates.length > 0 && (
                <div className="content-section">
                    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-gray-200)', overflow: 'hidden' }}>
                        {/* Week Header */}
                        <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)' }}>
                            <h4 style={{ textAlign: 'center', margin: 0, color: 'var(--color-gray-800)' }}>
                                📆 {nextWeekDateStr.split(" ")[1]} {nextWeekDateStr.split(" ")[3]}
                            </h4>
                        </div>

                        <div className="table-responsive">
                            <table className="schedule-grid">
                                <thead>
                                    <tr>
                                        <th style={{ background: 'var(--color-gray-100)' }}>Time</th>
                                        {weekDates.map((wkday, index) => (
                                            <th
                                                key={wkday.id}
                                                style={{
                                                    background: isToday(wkday.date, wkday.month) ? 'var(--color-primary)' : 'var(--color-gray-100)',
                                                    color: isToday(wkday.date, wkday.month) ? 'var(--color-white)' : 'var(--color-gray-800)'
                                                }}
                                            >
                                                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
                                                    {['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'][wkday.day]}
                                                </div>
                                                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                                                    {wkday.date}
                                                </div>
                                                {isToday(wkday.date, wkday.month) && (
                                                    <div style={{ fontSize: 'var(--font-size-xs)' }}>Today</div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((item, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td className="schedule-time-slot">
                                                {item.time}
                                            </td>
                                            {Array.from({ length: 7 }, (_, colIndex) => {
                                                const lessons = getCurrentLesson(
                                                    item.time.substring(0, 2),
                                                    `${weekDates[colIndex].date}/${weekDates[colIndex].month}/${weekDates[colIndex].year}`
                                                );
                                                const isBookable = weekDates[colIndex].bookable;

                                                return (
                                                    <td key={colIndex} className="schedule-cell">
                                                        {lessons && lessons.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {lessons.map((lesson) => (
                                                                    <div
                                                                        key={lesson._id}
                                                                        className="schedule-lesson"
                                                                        style={{ cursor: 'pointer' }}
                                                                        title={`Lesson with ${lesson.learner}`}
                                                                    >
                                                                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                                                                            {lesson.learner}
                                                                        </div>
                                                                        <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>
                                                                            {lesson.area}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => bookAppointment(
                                                                    weekDates[colIndex].date,
                                                                    weekDates[colIndex].month,
                                                                    weekDates[colIndex].year,
                                                                    item.time
                                                                )}
                                                                disabled={!isBookable || focusedLearner === "0"}
                                                                style={{
                                                                    width: '100%',
                                                                    opacity: (!isBookable || focusedLearner === "0") ? 0.5 : 1,
                                                                    cursor: (!isBookable || focusedLearner === "0") ? 'not-allowed' : 'pointer'
                                                                }}
                                                            >
                                                                📅 Book
                                                            </button>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', align: 'center', gap: 'var(--space-1)' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)' }}></div>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>Today</span>
                        </div>
                        <div style={{ display: 'flex', align: 'center', gap: 'var(--space-1)' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)' }}></div>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>Booked Lesson</span>
                        </div>
                        <div style={{ display: 'flex', align: 'center', gap: 'var(--space-1)' }}>
                            <div style={{ width: '12px', height: '12px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--border-radius-sm)' }}></div>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>Available</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {schedule.length === 0 && focusedInstructor !== "0" && (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📅</div>
                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                        No Schedule Available
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)' }}>
                        The schedule will load once you select an instructor.
                    </p>
                </div>
            )}
        </div>
    )

    // Helper function to check if a date is today
    function isToday(date, month) {
        const today = new Date();
        return date === today.getDate() && month === today.getMonth();
    }
}
