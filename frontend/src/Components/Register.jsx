import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigateTo = useNavigate();
  const handleValidation = () => {
    let formIsValid = true;

    if (!email) {
      formIsValid = false;
      setEmailError("Email is required");
    } else if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
    } else {
      setEmailError("");
    }
    if (!password) {
      formIsValid = false;
      setErrorMessage("Password is required");
    }
    return formIsValid;
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      console.log("REGISTER ");
      console.log(username, password, email);
      fetch(`http://localhost:3000/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          role_id: 2,
          // role_id: role === "admin" ? 1 : 2,
          password_hash: password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Network response was not ok");
            alert("Please Enter Valid Credentials");
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // console.log(data);
          navigateTo("/");
        })
        .catch((error) => {
          setErrorMessage("Error Signing in New User");
          console.error("Error Signing in New User: ", error);
        });
    }
  };

  return (
    <div className="login-body">
      <div className="login-img">
        <img src="src\assets\images\register.jpg" alt="register.jpg" />
      </div>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12">
            <h1 className="login-h1">Create New Account</h1>
            <form id="registerform" onSubmit={registerSubmit}>
              <div className="form-group">
                <label className=" label">Username</label>
                <input
                  type="text"
                  className="form-control login-input"
                  id="usernameInput"
                  name="usernameInput"
                  required
                  placeholder="Enter Username"
                  onChange={(event) => setUsername(event.target.value)}
                />

                <label className=" label">Email address</label>
                <input
                  type="email"
                  className="form-control login-input"
                  id="EmailInput2"
                  name="EmailInput2"
                  aria-describedby="emailHelp2"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <small id="emailHelp2" className="text-danger form-text">
                  {emailError}
                </small>
              </div>
              <div className="form-group">
                <label className=" label">Password</label>
                <input
                  type="password"
                  className="form-control login-input"
                  id="exampleInputPassword2"
                  placeholder="Enter Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary login-button">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
