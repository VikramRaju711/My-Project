import React, { Fragment, useState, useEffect } from "react";

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "./components/input";
import Login from "./components/login";
import Register from "./components/register";
import Otp from "./components/otp";

import "./App.css";

toast.configure();
function App() {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const setVerify = (boolean) => {
    setIsVerified(boolean);
  };

  return (
    <Fragment>
      <BrowserRouter>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/otp:id"
              render={(props) =>
                isVerified ? (
                  <Otp {...props} setVerify={setVerify}></Otp>
                ) : (
                  <Redirect to="/input" />
                )
              }
            />
            <Route
              exact
              path="/login"
              render={(props) =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/input" />
                )
              }
            />
            <Route exact path="/register">
              <Register></Register>
            </Route>
            <Route
              exact
              path="/input"
              render={(props) =>
                isAuthenticated ? (
                  <Input {...props} setAuth={setAuth} setVerify={setVerify} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Redirect from="/" to="/login"></Redirect>
          </Switch>
        </div>
      </BrowserRouter>
    </Fragment>
  );
}
export default App;
