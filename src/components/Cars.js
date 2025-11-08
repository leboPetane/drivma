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

    const getCarsFromServer = async (drivingSchoolId) => {
        let tempCars = [];
        const res  = await fetch(`http://localhost:3000/api/cars`, {
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
        const res  = await fetch(`http://localhost:3000/api/cars/${id}`, {
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
        
        let res  = await fetch(`http://localhost:3000/api/cars${endpoint}`, {
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

            let res  = await fetch(`http://localhost:3000/api/instructors/${assignedDriver}`, {
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
        <div className="content-section">
            <div className="d-flex justify-between align-center mb-6">
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                    🚗 Vehicle Management
                </h3>
                <button
                    className="btn btn-primary"
                    onClick={() => addCar()}
                >
                    <span>➕</span>
                    <span>Add Vehicle</span>
                </button>
            </div>

            {cars.length > 0 ? (
                <div className="table-responsive">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Vehicle Name</th>
                                <th>Model Year</th>
                                <th>Disc Expiry</th>
                                <th>Assigned Instructor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car._id}>
                                    <td>
                                        <div style={{ display: 'flex', align: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontSize: '1.2rem' }}>🚗</span>
                                            <div>
                                                <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{car.name}</div>
                                                {car.serviced && (
                                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Serviced</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-secondary">{car.year}</span>
                                    </td>
                                    <td>
                                        {car.disc_expiry ? (
                                            <span className={`badge ${isExpirySoon(car.disc_expiry) ? 'badge-warning' : 'badge-info'}`}>
                                                📅 {car.disc_expiry}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        {car.driver ? (
                                            <div>
                                                <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                                                    👤 {car.driver}
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Unassigned</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => focusOnCar(car._id)}
                                                title="Edit vehicle"
                                            >
                                                ⚙️
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to remove ${car.name}?`)) {
                                                        removeCar(car._id);
                                                    }
                                                }}
                                                title="Remove vehicle"
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
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚗</div>
                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                        No vehicles in your fleet
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                        Add your first vehicle to start managing your driving school fleet.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => addCar()}
                    >
                        <span>➕</span>
                        <span>Add First Vehicle</span>
                    </button>
                </div>
            )}

            {isFocused && (
                <div className="content-section" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                {focusedCar ? 'Edit Vehicle' : 'Add New Vehicle'}
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
                                        <label className="form-label">Vehicle Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carName}
                                            onChange={(e) => setCarName(e.target.value)}
                                            placeholder="e.g., Toyota Corolla"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Model Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={carYear}
                                            onChange={(e) => setCarYear(parseInt(e.target.value) || 2000)}
                                            min="1900"
                                            max="2030"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Disc Expiry Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={carExpiry}
                                            onChange={(e) => changeCarExpiry(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Assign to Instructor</label>
                                        <select
                                            className="form-control"
                                            value={assignedDriver}
                                            onChange={(e) => setAssignedDriver(e.target.value)}
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
                                </div>

                                <div className="d-flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setIsFocused(false);
                                            setFocusedCar("");
                                            setErrMsg("");
                                            setCarName("");
                                            setCarYear(2000);
                                            setCarExpiry("");
                                            setAssignedDriver("0");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            saveCar(focusedCar);
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="btn-loading"></span> : (focusedCar ? 'Update Vehicle' : 'Add Vehicle')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Fleet Statistics */}
            {cars.length > 0 && (
                <div className="content-section" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="stats-grid">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🚗</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {cars.length}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Total Vehicles
                                </p>
                            </div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>👤</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {cars.filter(car => car.driver).length}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Assigned Vehicles
                                </p>
                            </div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="card-body">
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📅</div>
                                <h4 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 var(--space-1) 0' }}>
                                    {cars.filter(car => isExpirySoon(car.disc_expiry)).length}
                                </h4>
                                <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    Expiring Soon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    // Helper function to check if disc expiry is within 30 days
    function isExpirySoon(expiryDate) {
        if (!expiryDate) return false;

        try {
            const [day, month, year] = expiryDate.split('/');
            const expiry = new Date(`${year}-${month}-${day}`);
            const today = new Date();
            const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

            return expiry <= thirtyDaysFromNow;
        } catch (error) {
            return false;
        }
    }
}
