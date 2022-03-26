import React from 'react'
import { useState, useEffect } from 'react'

export const Students = () => {

    const [memberForm, setMemberForm] = useState(false)

    return (
        <div>
            <div>
                <button className="btn btn-default btn-round" onClick={(e) => {e.preventDefault(); setMemberForm(!memberForm)}}>+ Add New</button>
            </div>
            <div className="table-responsive">
                <table className="table">
                   <thead className=" text-primary">
                       <tr>
                            <th> Name </th>
                            <th> City </th>
                            <th> Mobile </th>
                            <th> Training Car </th>
                            <th> Assigned Instructor </th>
                            <th> Test Date </th>
                            <th>  </th>
                       </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Dakota Rice </td>
                        <td> Milnerton </td>
                        <td> 0731234567 </td>
                        <td> Tata Indica </td>
                        <td> John </td>
                        <td> 02/02/2022 </td>
                        <td> 
                            <button className="btn btn-sm btn-outline-danger ">remove</button>
                            <button className="btn btn-sm btn-outline-info ml-2">edit</button>
                        </td>
                      </tr>
                     
                    </tbody>
                </table>
            </div>
            {/* kjsjkfsjksfhkskj */}
            {memberForm && 
            <div className = "row card">
                <div class="col-md-12">
                    
                    <div class="card-body">
                    <form>
                        <div class="row">
                            <div class="col-md-4 pr-1">
                                <div class="form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" class="form-control" disabled="" placeholder="Company" value="0731234567"></input>
                                </div>
                            </div>
                            <div class="col-md-4 px-1">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="text" class="form-control" placeholder="Username" value="dekota.rice@gmail.com"></input>
                                </div>
                            </div>
                            <div class="col-md-4 pl-1">
                                <div class="form-group">
                                    <label HtmlFor="exampleInputEmail1">Passcode</label>
                                    <input type="email" class="form-control" value="heAndSheDekota2021"></input>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 pr-1">
                                <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control" placeholder="Company" value="Dakota "></input>
                                </div>
                            </div>
                            <div class="col-md-6 pl-1">
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control" placeholder="Last Name" value="Rice"></input>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Training Car</label>
                                    <select className="form-group form-control">
                                        <option>
                                         Tata Indica
                                        </option>
                                        <option>
                                            Huydai i20
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Address</label>
                                    <input type="text" class="form-control" placeholder="Home Address" value="1 Main Road, Woodbridge, Milnerton, 7441"></input>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                                <div class="update ml-auto mr-auto">
                                <button type="submit" class="btn btn-primary btn-round">Save Learner</button>
                                </div>
                         </div>
                        </form>
                    </div>
                </div>
            </div> }
        </div>
    )
}
