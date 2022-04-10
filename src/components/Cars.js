import { useState, useEffect } from "react";
import { Cookies } from 'react-cookie'

export const Cars = ({logout}) => {

    useEffect(() => {
        let cookie =  new Cookies();
        if(cookie.get("userId") === undefined || cookie.get("UserLoggedIn") === undefined) logout();

        const getCars = async () => {
            const carsFromServer = await getCarsFromServer(cookie.get("userId"));
            setCars(carsFromServer);
        }

        const getInstructors = async () => {
            let cookie =  new Cookies();
            const instructorsFromServer = await getInstructorsFromServer(cookie.get("userId"));
            setInstructors(instructorsFromServer);
          }

        getCars();
        getInstructors();
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

    const getCarsFromServer = async (drivingSchoolId) => {
        let tempCars = [];
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/cars`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (res.status === 200){
            const data     = await res.json();
            tempCars = data.filter((obj) => obj.driving_school_id === drivingSchoolId);
        }
        return tempCars;
    }

    const [cars,           setCars]           = useState([])
    const [instructors,    setInstructors]    = useState([])
    const [isFocused,      setIsFocused]      = useState(false)
    const [focusedCar,     setFocusedCar]     = useState("")
    const [carName,        setCarName]        = useState("")
    const [carYear,        setCarYear]        = useState(2000)
    const [carExpiry,      setCarExpiry]      = useState("")
    const [assignedDriver, setAssignedDriver] = useState("0")
    const [errMsg,         setErrMsg]         = useState("")
    const [isLoading,      setIsLoading]      = useState(false)

    const focusOnCar = (carId) => {
        setIsLoading(false);
        setErrMsg("");
        if (focusedCar === carId && isFocused){
            setIsFocused(!isFocused);
            setCarName("");      
            setCarYear(0);      
            setCarExpiry();    
            setAssignedDriver("0");
            return;
        }

        const theCar  = cars.filter((obj) => obj._id === carId)[0];
        const dateArr = theCar.disc_expiry.split("/");
        const dateStr = dateArr[2] + "-" + (dateArr[1].length === 1 ? "0" + dateArr[1] : dateArr[1]) + "-" + dateArr[0];
        setCarName(theCar.name);      
        setCarYear(theCar.year);      
        setCarExpiry(dateStr);    
        setAssignedDriver(theCar.instructor_id);
        setIsFocused(true);
        setFocusedCar(carId);

    }

    const changeCarExpiry = (inputDt) => {
        setCarExpiry(inputDt);    
    }

    const addCar = () => {
        setErrMsg("");
        if (focusedCar === "" && isFocused){
            setIsFocused(!isFocused);
            setCarName("");      
            setCarYear(0);      
            setCarExpiry();    
            setAssignedDriver("0");
            return;
        }

        setFocusedCar("");
        setIsFocused(true);
        setCarName("");      
        setCarYear(0);      
        setCarExpiry();    
        setAssignedDriver("0");

    }

    const removeCar = async (id) => {
        const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (res.status === 200){
            const myCookie = new Cookies();
            setIsFocused(false);
            const updatedCars = await getCarsFromServer(myCookie.get("userId"));
            setCars(updatedCars);
        }else{
            console.log("Error deleting car: " + res.status + " | " + res.statusText);
        }
    }

    const saveCar = async (id) => {
        setIsLoading(true);
        setErrMsg("");
        if (carName === ""){
            setErrMsg("Car name is required.");
            setIsLoading(false);
            return;
        }
        if (carYear < 1000){
            setErrMsg("The car year is not valid");
            setIsLoading(false);
            return;
        }
        if (carYear < 1000){
            setErrMsg("The car year is not valid");
            setIsLoading(false);
            return;
        }
        if (carExpiry === undefined || carExpiry === null){
            setErrMsg("The Car expiry date is not valid");
            setIsLoading(false);
            return;
        }
        if (assignedDriver === "0"){
            setIsLoading(false);
            setErrMsg("Please select a driver");
            return;
        }

        const myCookie      = new Cookies();
        let theChosenDriver = instructors.filter((obj) => obj._id === assignedDriver)[0];

        if (theChosenDriver === undefined){
            setIsLoading(false);
            setErrMsg("Please select a driver");
            return;
        }
            theChosenDriver = theChosenDriver.first_name + " " + theChosenDriver.last_name;

        const myObj = {
            driving_school_id: myCookie.get("userId"),
            instructor_id: assignedDriver,
            year: carYear,
            disc_expiry: carExpiry.split("-")[2] + "/" + carExpiry.split("-")[1] + "/" + carExpiry.split("-")[0],
            name: carName,
            driver: theChosenDriver,
            serviced:true
        } 

        const endpoint = (id === "" ? "" : "/" + focusedCar);
        
        let res  = await fetch(`${process.env.REACT_APP_API_URL}/api/cars${endpoint}`, {
            method: (id === "" ? 'POST' : 'PUT'),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(myObj)
        });
        setIsLoading(false);
        if (res.status === 200){
            setIsFocused(false);
            const updatedCars = await getCarsFromServer(myCookie.get("userId"));
            setCars(updatedCars);

            const driverUpdate = {
                training_car: myObj.name,
                training_car_id: cars[cars.length -1]._id
            }

            let res  = await fetch(`${process.env.REACT_APP_API_URL}/api/instructors/${assignedDriver}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(driverUpdate)
            });

        }else{
            setErrMsg("Error saving car: " + res.status + " | " + res.statusText);
        }

    }
    return (
        <div>
            <div className="card">
                <div className="table-responsive pl-3">
                <button className="btn btn-primary btn-round" onClick={() => addCar()}>+ Toggle Add Car</button>

                    <table className="table">
                        <thead className="text-primary">
                            <tr>
                                <th> Car Name </th>
                                <th> Model Year </th>
                                <th> Expiry Date </th>
                                <th> Assigned Driver </th>
                                <th>  </th>
                                <th>  </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            cars.map((car) => 
                                <tr key={car._id} className="col-md-12 mb-3">
                                    <td className="card-title">{car.name} </td>
                                    <td>{car.year}</td>
                                    <td>{car.disc_expiry}</td>
                                    <td>{car.driver}</td>
                                    <td> <button className="btn btn-small btn-outline-danger" onClick={() => removeCar(car._id)}>remove</button> </td>
                                    <td> <button className="btn btn-sm btn-outline-success btn-round btn-icon" onClick={() => focusOnCar(car._id)}><i className="nc-icon nc-settings-gear-65"></i></button> 
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-md-12">
                {isFocused &&
                <div className="card card-user">
                    <div className="card-header">
                        {/* <h5 className="card-title">Add Car</h5> */}
                        {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}

                    </div>  
                    <div className="card-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6 pr-1">
                                    <div className="form-group">
                                        <label>Car Name</label>
                                        <input type="text" className="form-control" value={carName} onChange={(e) => setCarName(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className="col-md-6 pl-1">
                                    <div className="form-group">
                                        <label htlmfor="exampleInputEmail1">Year</label>
                                        <input type="number" className="form-control" value={carYear} onChange={(e) => setCarYear(e.target.value)}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 pr-1">
                                    <div className="form-group">
                                        <label>Disc Expiry Date</label>
                                        <input type="date" className="form-control" value={carExpiry} onChange={(e) => changeCarExpiry(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className="col-md-6 pl-1">
                                <div className="form-group">
                                        <label>Assign To Driver</label>
                                        <select className="form-group form-control" value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)}>
                                            <option>
                                                {"<Select Car>"}
                                            </option>
                                            {
                                                instructors.map((obj) => <option value={obj._id} key={obj._id}>{obj.first_name + " " + obj.last_name}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="update ml-auto mr-auto">
                                <button className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault(); saveCar(focusedCar)}} disabled={isLoading}>Save Car</button>
                                </div>
                            </div>
                        </form>
                    </div>  
                </div>}
            </div>
        </div>
    )
}
