import { useState } from "react";

export const Cars = () => {

    const [cars, setCars] = useState([
        {
            id : 1,
            name: "Huydai i20",
            serviced: true,
            expire: "12/10/2026",
            driver: "Paul Tim"
        },
        {
            id: 2,
            name: "Polo",
            serviced: true,
            expire: "01/02/2025",
            driver: "John"
        },
        {
            id : 3,
            name: "Huydai i20",
            serviced: true,
            expire: "12/10/2026",
            driver: "Paul Tim"
        },
        {
            id: 4,
            name: "Polo",
            serviced: true,
            expire: "01/02/2025",
            driver: "John"
        },
        {
            id : 5,
            name: "Huydai i20",
            serviced: true,
            expire: "12/10/2026",
            driver: "Paul Tim"
        },
        {
            id: 6,
            name: "Polo",
            serviced: true,
            expire: "01/02/2025",
            driver: "John"
        }
    ])
    return (
        <div>
            <div className="card-deck">
                {
                    cars.map((car) => 
                        <div key={car.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                <h5 className="card-title">{car.name} </h5>
                                <button className="btn btn-small btn-outline-danger" onClick={() => setCars(cars.filter((c) => c.id !== car.id))}>remove</button>
                                <p className="card-text">
                                <i className="nc-icon nc-bus-front-12"></i>
                                </p>
                                <p className="card-text"><small className="text-muted">{car.driver}</small>  </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div class="col-md-12">
                <div class="card card-user">
                    <div class="card-header">
                        <h5 class="card-title">Add Car</h5>
                    </div>  
                    <div class="card-body">
                        <form>
                            <div class="row">
                                <div class="col-md-6 pr-1">
                                    <div class="form-group">
                                        <label>Car Name</label>
                                        <input type="text" class="form-control" ></input>
                                    </div>
                                </div>
                                <div class="col-md-6 pl-1">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Year</label>
                                        <input type="date" class="form-control" ></input>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 pr-1">
                                    <div class="form-group">
                                        <label>Disc Expiry Date</label>
                                        <input type="date" class="form-control" ></input>
                                    </div>
                                </div>
                                <div class="col-md-6 pl-1">
                                <div class="form-group">
                                        <label>Assign To Driver</label>
                                        <select className="form-group form-control">
                                            <option>
                                                Paul TIm
                                            </option>
                                            <option>
                                                John
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="update ml-auto mr-auto">
                                <button type="submit" class="btn btn-primary btn-round">Save Car</button>
                                </div>
                            </div>
                        </form>
                    </div>  
                </div>
            </div>
        </div>
    )
}
