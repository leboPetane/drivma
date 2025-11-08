import React from 'react'
import { useState } from 'react';

const Login = ({ signin }) => {
  const myauth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    var res = null;
    var data = null;

    try {
      res = await fetch("http://localhost:3000/api/users", {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        }
      });
      data = await res.json();

    } catch (err) {
      console.log(err)
    }

    if (data === null) {
      setIsLoading(false)
      setErrMsg("Error Logging In. Please try again later.");
      return;
    }
    setIsLoading(false);
    const user = data.filter((obj) => obj.email === inputEmail)[0];

    if (!user) {
      setErrMsg("No account exist with the entered email address. Please try again");
      return;
    }

    var CryptoJS = require("crypto-js");
    var ciphertext = user.password
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'dr|v|ngsc00lmanager!@#$%');
    var decryptedPsw = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedPsw !== inputPassword) {
      setErrMsg("The password is incorrect.");
      return;
    }
    signin(user);
  }

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [drivingSchoolName, setDrivingSchoolName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const toggleSignUp = (is_signup) => {
    setErrMsg("");
    setIsSignUp(is_signup);
  }

  const signup = async (e) => {
    e.preventDefault();
    if (inputEmail === "") {
      setErrMsg("Email is required");
      return;
    }
    if (inputPassword === "" || inputPassword2 === "") {
      setErrMsg("Please confirm your password.");
      return;
    }
    if (drivingSchoolName === "") {
      setErrMsg("Please enter the name of your driving school");
      return;
    }
    if (inputPassword !== inputPassword2) {
      setErrMsg("Password 1 and password 2 does not match. Please try again");
      return;
    }
    if (firstName === "") {
      setErrMsg("Please enter your first name.");
      return;
    }

    var CryptoJS = require("crypto-js");
    var cipherPsw = CryptoJS.AES.encrypt(inputPassword, 'dr|v|ngsc00lmanager!@#$%').toString();

    const myobj = {
      first_name: firstName,
      last_name: lastName,
      driving_school: drivingSchoolName,
      email: inputEmail,
      password: cipherPsw
    }

    var res = null;
    var data = null;

    setIsLoading(true);
    res = await fetch(`http://localhost:3000/api/users`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    });
    data = await res.json();
    const user = data.filter((obj) => obj.email === inputEmail)[0];

    if (user) {
      setIsLoading(false);
      setErrMsg("Driving School Already exist with that email address.");
      return;
    }

    res = await fetch(`http://localhost:3000/api/users`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(myobj)
    });
    setIsLoading(false);

    if (res.status === 200) {
      setIsSignUp(false);
      setErrMsg("Signed Up Successfully!");
      return;
    } else {
      setErrMsg("There was a problem signing you up, please try again later.");
    }

  }

  return (
    <div className='login-container'>
      {isLoading && (
        <div className="app-loading">
          <div className="app-loading-spinner"></div>
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🚗</div>
          <h1 className="login-title">DRIVMA</h1>
          <p className="login-subtitle">
            {isSignUp ? "Create Your Account" : "A driving school management system"}
          </p>
          {!isSignUp && (
            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-2)' }}>
              Demo: test@test.com / test123
            </p>
          )}
        </div>

        {isSignUp ? (
          <form className="login-form" onSubmit={(e) => signup(e)}>
            {errMsg && (
              <div className={errMsg.includes("Successfully") ? "alert alert-success" : "alert alert-error"}>
                {errMsg}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Driving School Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name of your driving school"
                value={drivingSchoolName}
                onChange={(e) => setDrivingSchoolName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={inputPassword2}
                onChange={(e) => setInputPassword2(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? <span className="btn-loading"></span> : "Sign Up"}
            </button>

            <div className="login-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="login-link"
                onClick={() => toggleSignUp(false)}
              >
                Back to login
              </button>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={(e) => myauth(e)}>
            {errMsg && (
              <div className="alert alert-error">
                {errMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? <span className="btn-loading"></span> : "Sign In"}
            </button>

            <div className="login-footer">
              Don't have an account?{" "}
              <button
                type="button"
                className="login-link"
                onClick={() => toggleSignUp(true)}
              >
                Sign Up Your Driving School
              </button>
            </div>

            <div className="text-center mt-6">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>
                © 2024 DRIVMA. All rights reserved.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login