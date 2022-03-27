import React from 'react'
import { useState } from 'react';

const Login = ({signin}) => {

  const myauth = async (e) => {
    e.preventDefault();

    var res  = null;
    var data = null;

    try{
         res  = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        data = await res.json();

    }catch(err){
        console.log(err)
    }

    if (data === null){
        setErrMsg("Error Logging In. Please try again later.");
        return;
    }

    const user = data.filter((obj) => obj.email === inputEmail)[0];

    if (!user){
        setErrMsg("No account exist with the entered email address. Please try again");
        return;
    }

    if (user.password !== inputPassword){
        setErrMsg("The password is incorrect.");
        return;
    }
    signin(user);
  }  

  const [inputEmail, setInputEmail]       = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errMsg, setErrMsg]               = useState("");

  return (
      <div className='mybody'>
          <div className='container text-center mt-5 pt-5'>
          <h1 className="h3 mb-3 font-weight-normal">DRIVMA</h1>
          <p>A driving school management system</p>
            <form className="form-signin form-group">
                {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}

                <input type="email"    onChange={(e) => setInputEmail(e.target.value)}   className="form-control" placeholder="Email address" required autoFocus></input>
                <input type="password"  onChange={(e) => setInputPassword(e.target.value)} className="form-control" placeholder="Password" required></input>
                
                <button className="btn btn-lg btn-primary btn-block" onClick={(e) => myauth(e)}>Sign in</button>
                <p className="mt-5 mb-3 text-muted">&copy; 2021</p> 
            </form>

        </div>
      </div>
    
  )
}

export default Login