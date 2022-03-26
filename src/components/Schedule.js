import React from 'react'
import { useState, useEffect } from 'react'

export const Schedule = () => {

    //var dt    = new Date();
    useEffect(() => {
        setWeeklyDates(new Date())
    }, [])

    const setWeeklyDates = (dt) => {
        var dates = [1,2,3,4,5,6,7];
        if (dt.getDay() > 0){
            dt.setDate(dt.getDate() - dt.getDay());
        }
    
        var newDt = new Date()
        for(var i in dates) {
            dates[i] = {
                            id: Math.floor(Math.random()*5689),
                            day: dt.getDay(),
                            date: dt.getDate(),
                            month: dt.getMonth(),
                            year: dt.getFullYear(),
                            bookable: (dt > newDt)
                       }
            dt.setDate(dt.getDate() + 1);
        }
        setWeekDays(dates)
        setNextWeekDate(dt)
        setNextWeekDateStr(dt.toDateString())
    }

    const onNext = () => {
        setWeeklyDates(nextWeekDate)
    }

    const onPrev = () => {
        var dt = new Date(nextWeekDate)
        var dt = new Date(dt.setDate(dt.getDate() - 14))
        setWeeklyDates(new Date(dt))
    }

    const bookAppointment = (day, month, year, time) => {
        alert("Appointment booked for: " + day+"/"+month+"/"+year+"@"+time+ " | " + "Tim Dorothy");
    }

    const instructorFilter = (id) =>{
        //get only instructor with id
        alert("Filtering by id: " + id);
    }

    const learnerFilter = (id) =>{
        //get only instructor with id
        alert("Filtering by id: " + id);
    }

    const [nextWeekDate, setNextWeekDate]       = useState(new Date())
    const [nextWeekDateStr, setNextWeekDateStr] = useState(nextWeekDate.toDateString())
    const [weekDates, setWeekDays]              = useState([{},{},{},{},{},{},{}])
    const [instructors, setInstructors]         = useState([{
            id: 1,
            name: "Instructor 1"
        },
        {
            id: 2,
            name: "Instructor 2"
        }
    ])
    const [learners, setLearners]         = useState([{
            id: 1,
            name: "Learner 1"
        },
        {
            id: 2,
            name: "Learner 2"
        }
    ])
    const [schedule, setSchedule]               = useState([
        {
            time:"07:00",
            sunday: ["Lebo in Goodwood, Tim Dorothy"],
            monday: [],
            tuesday: ["John in Belhar , Tim Dorothy"],
            wednesday: ["Lebo in Goodwood, Tim Dorothy", "John in Belhar, Tim Dorothy"],
            thursday: ["John in Belhar, Tim Dorothy"],
            friday: [],
            saturday:["John in Belhar, Tim Dorothy"]
        },
        {
            time:"08:00",
            sunday: ["Lebo in Goodwood, Tim Dorothy"],
            monday: ["John in Belhar , Tim Dorothy"],
            tuesday: ["John in Belhar , Tim Dorothy"],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday:["Lebo in Goodwood, Tim Dorothy"]
        },
        {
            time:"09:00",
            sunday: ["Lebo in Goodwood, Tim Dorothy"],
            monday: ["John in Belhar , Tim Dorothy"],
            tuesday: ["John in Belhar , Tim Dorothy"],
            wednesday: [],
            thursday: [],
            friday: ["Lebo in Goodwood, Tim Dorothy"],
            saturday:["Lebo in Goodwood, Tim Dorothy"]
        },
        {
            time:"10:00",
            sunday: [],
            monday: [],
            tuesday: ["John in Belhar , Tim Dorothy"],
            wednesday: ["Lebo in Goodwood, Tim Dorothy"],
            thursday: ["Lebo in Goodwood, Tim Dorothy"],
            friday: ["Lebo in Goodwood, Tim Dorothy"],
            saturday:["Lebo in Goodwood, Tim Dorothy"]
        }
    ])

    return (
        <div>
            <div className='card p-2'>
                <b className='pr-5 mr-3'>Filter by:</b> 
                <div className='d-flex p-3'>
                    
                    <select className="form-group form-control mr-2" onChange={(e) => instructorFilter(e.target.value)}>
                        <option value="0">Instructor</option>
                        {instructors.map((instr) => <option value={instr.id}>{instr.name}</option>)}
                    </select>
                    <select className="form-group form-control" onChange={(e) => learnerFilter(e.target.value)}>
                        <option value="0">Student</option>
                        {learners.map((learner) => <option value={learner.id}>{learner.name}</option>)}
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
                                    <tr key={Math.random() * 120 }>
                                        <th> {item.time}    </th>
                                        <td>
                                            {item.sunday.map(lesson =>
                                                <p key="dgcfhvb9">{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.sunday.length === 0 &&
                                            <button disabled={!weekDates[0].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[0].date,weekDates[0].month,weekDates[0].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {item.monday.map(lesson => 
                                                <p key={Math.random()*899 + "dgc8vb90"}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.monday.length === 0 &&
                                                <button disabled={!weekDates[1].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[1].date,weekDates[1].month+1,weekDates[1].year,item.time)}>Book Appointment</button> 
                                            }
                                            </td>
                                        <td>
                                            {item.tuesday.map(lesson => 
                                                <p key={Math.random()*899 + "fkhbkn,d"}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.tuesday.length === 0 &&
                                            <button disabled={!weekDates[2].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[2].date,weekDates[2].month+1,weekDates[2].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {item.wednesday.map(lesson => 
                                                <p key={lesson + Math.random()*500}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.wednesday.length === 0 &&
                                            <button disabled={!weekDates[3].bookable}  className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[3].date,weekDates[3].month+1,weekDates[3].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {item.thursday.map(lesson => 
                                                <p key={Math.random()*899 + "fkhkjd"}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.thursday.length === 0 &&
                                            <button disabled={!weekDates[4].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[4].date,weekDates[4].month+1,weekDates[4].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {item.friday.map(lesson => 
                                                <p key={Math.random()*899 + "fiud"}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.friday.length === 0 &&
                                            <button disabled={!weekDates[5].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[5].date,weekDates[5].month+1,weekDates[5].year,item.time)}>Book Appointment</button> 
                                            }
                                        </td>
                                        <td>
                                            {item.saturday.map(lesson => 
                                                <p key={Math.random()*899 + "fd"}>{lesson.split(',')[0]} <br></br> <span className='badge badge-warning'>{lesson.split(',')[1]} </span></p>
                                            )}
                                            {item.saturday.length === 0 &&
                                            <button disabled={!weekDates[6].bookable} className='btn btn-outline-info' onClick={() => bookAppointment(weekDates[6].date,weekDates[6].month+1,weekDates[6].year,item.time)}>Book Appointment</button> 
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
