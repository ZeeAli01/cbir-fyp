import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/auth";

function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigateTo = useNavigate();
  const { storeTokenInLS } = useAuth();
  const { storeRoleIdInLS } = useAuth();
  const { storeUsernameInLS } = useAuth();
  const handleValidation = () => {
    let formIsValid = true;

    if (!username) {
      formIsValid = false;
      setUsernameError("username is required");
    } else {
      setUsernameError("");
    }

    if (!password) {
      formIsValid = false;
      setErrorMessage("Password is required");
    }

    return formIsValid;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      //LOGIN API:
      fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password_hash: password,
          role_id: username === "admin" ? 1 : 2,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Network response was not ok");
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          let accessToken = data.accessToken;
          if (accessToken) {
            storeUsernameInLS(username);
            storeTokenInLS(accessToken);
            storeRoleIdInLS(data.role_id);
            navigateTo("/");
          }
        })
        .catch((error) => {
          setErrorMessage("Error Logging in User");
          console.error("Error Logging in User:", error);
        });
    }
  };

  return (
    <div className="login-body">
      <div className="login-img">
        <img src="src\assets\images\login.jpg" alt="login.jpg" />
      </div>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <h1 className="login-h1">Sign In</h1>
          <div className="col-md-12">
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group">
                <label className="label">Username</label>

                <input
                  type="text"
                  className="form-control login-input"
                  id="UsernameInput"
                  name="UsernameInput"
                  aria-describedby="usernameHelp"
                  placeholder="Enter Username"
                  onChange={(event) => setUsername(event.target.value)}
                />

                <small id="usernameHelp" className="text-danger form-text">
                  {usernameError}
                </small>
              </div>
              <div className="form-group">
                <label className=" label">Password</label>
                <input
                  type="password"
                  className="form-control login-input"
                  id="exampleInputPassword1"
                  placeholder="Enter Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <button type="submit" className="btn  btn-primary login-button">
                Login
              </button>
              <Link
                className="new-user-link hover-underline-animation1"
                to="/register"
              >
                New to CBIR?
              </Link>
              <p
                className={
                  errorMessage === "Login Successful"
                    ? "success-msg"
                    : "error-msg"
                }
              >
                {errorMessage}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
