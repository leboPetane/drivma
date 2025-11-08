import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({signin}) => {

  const myauth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    var res  = null;
    var data = null;
    
    try{
         res  = await fetch("http://localhost:3000/api/users", {
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
        setIsLoading(false)
        setErrMsg("Error Logging In. Please try again later.");
        return;
    }
    setIsLoading(false);
    const user = data.filter((obj) => obj.email === inputEmail)[0];

    if (!user){
        setErrMsg("No account exist with the entered email address. Please try again");
        return;
    }

    var CryptoJS      = require("crypto-js");
    var ciphertext    = user.password
    var bytes         = CryptoJS.AES.decrypt(ciphertext, 'dr|v|ngsc00lmanager!@#$%');
    var decryptedPsw  = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedPsw !== inputPassword){
        setErrMsg("The password is incorrect.");
        return;
    }
    signin(user); 
  }  

  const [inputEmail, setInputEmail]       = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [errMsg, setErrMsg]               = useState("");
  const [isLoading, setIsLoading]         = useState(false);
  const [isSignUp, setIsSignUp]           = useState(false);
  const [drivingSchoolName, setDrivingSchoolName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const toggeSignUp = (is_signup) => {
    setErrMsg("");
    setIsSignUp(is_signup);
  }

  const signup = async (e) => {
    setIsLoading(false);
    e.preventDefault();
    if (inputEmail === ""){
        setErrMsg("Email is required");
        return;
    }
    if (inputPassword === "" || inputPassword2 === ""){
        setErrMsg("Please confirm your password.");
        return;
    }
    if(drivingSchoolName === ""){
        setErrMsg("Please enter the name of your driving school");
        return;
    }
    if (inputPassword !== inputPassword2){
        setErrMsg("Password 1 and password 2 does not match. Please try again");
        return;
    }
    if (firstName === "" ){
        setErrMsg("Please enter your first name.");
        return;
    }
    

    var CryptoJS = require("crypto-js");
    var cipherPsw = CryptoJS.AES.encrypt(inputPassword, 'dr|v|ngsc00lmanager!@#$%').toString();

    const myobj = {
        first_name:firstName,
        last_name:lastName,
        driving_school:drivingSchoolName,
        email:inputEmail,
        password:cipherPsw
    }

    var res = null;
    var data = null;

    setIsLoading(true);
    res  = await fetch(`http://localhost:3000/api/users`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    });
    data = await res.json();
    const user = data.filter((obj) => obj.email === inputEmail)[0];

    if (user){
        setIsLoading(false);
        setErrMsg("Driving School Already exist with that email address.");
        return;
    }

    res  = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST' ,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(myobj)
    });
    setIsLoading(false);

    if (res.status === 200){
        setIsSignUp(false);
        setErrMsg("Signed Up Successfully!");
        return;
    }else{
        setErrMsg("There was a problem signing you up, please try again later.");
    }

  }

  return (
      <div className='mybody'>
          {isLoading &&
          <div className="load-wrapper">
            <h1 className="load-brand">
                <span>DRIVMA</span>
                {/* <span>in</span> */}
            </h1>
            <div className="loading-bar"></div>
          </div>}
          <div className="card-body">
          
          <div className='container text-center mt-5 pt-5'>
          <h1 className="h3 mb-3 font-weight-normal">DRIVMA</h1>
           
          <p>{isSignUp ? "Sign Up" : "A driving school management system" }</p> 
          {!isSignUp && <p className='m-0 p-0 text-info'><i>Demo Account - username: test@test.com, password: test123</i></p>}

          {isSignUp ?
          <form className="form-signin form-group jumbotron">
             {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}

            <input type="email"    onChange={(e) => setInputEmail(e.target.value)}   className="form-control" placeholder="Email address" required autoFocus></input>
            <input type="password"  onChange={(e) => setInputPassword(e.target.value)} className="form-control" placeholder="Password" required></input>
            <input type="password"  onChange={(e) => setInputPassword2(e.target.value)} className="form-control" placeholder="Confirm Password" required></input>
            <input type="text"    onChange={(e) => setDrivingSchoolName(e.target.value)} className="form-control" placeholder="Name of your driving school" required></input>
            <input type="text"    onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="First Name" required></input>
            <input type="text"    onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Last Name" required></input>
            <p className="mt-5 mb-3 text-muted"> If you are interested to use this for your driving school please email lebopetane@gmail.com to create an account . </p> 

            <button className="btn btn-lg btn-primary btn-block" onClick={(e) => signup(e)} disabled>Sign up</button>
            <Link to="#" onClick={() => toggeSignUp(false)}>Back to login</Link>



          </form>:
            <form className="form-signin form-group">
                {(errMsg !== "") && <p className="alert-danger p-2">{errMsg}</p>}

                <input type="email"    onChange={(e) => setInputEmail(e.target.value)}   className="form-control" placeholder="Email address" required autoFocus></input>
                <input type="password"  onChange={(e) => setInputPassword(e.target.value)} className="form-control" placeholder="Password" required></input>
                
                <button className="btn btn-lg btn-primary btn-block" onClick={(e) => myauth(e)}>Sign in</button>
                <Link to="#" onClick={() => toggeSignUp(true)}>Sign Up Your Driving School Here</Link>
                <p className="mt-5 mb-3 text-muted">&copy; 2022</p> 
            </form>}

        </div></div>
      </div>
    
  )
}

export default Login