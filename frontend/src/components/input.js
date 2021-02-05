import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    margin: "10px",

    alignItems: "center",
  },
  text: {
    width: "100%",
  },
}));

const Input = ({ setVerify, setAuth }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  // const [inputs, setInputs] = useState({
  //   message: "",
  // });

  //const { message } = inputs;
  const onChange = (e) => {
    //setInputs({ ...inputs, [e.target.name]: e.target.value });
    const { value } = e.target;
    setMessage(value);
  };
  const [otp, setOtp] = useState("");
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [nextpage, setNextpage] = useState("");
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/input", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await res.json();
      setId(parseData.id);
    } catch (err) {
      console.error(err.message);
    }
  };
  getProfile();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    //const token = localStorage.token;
    const body = { message, id };

    try {
      const response = await fetch("http://localhost:5000/auth/encrypted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      setToken(parseRes.token);
      setNextpage("http://localhost:3000/otp" + parseRes.token);
      if (parseRes.otp) {
        localStorage.setItem("token2", parseRes.token2);
        toast.success("Message Encrypted ");
        setOtp("Your OTP is " + parseRes.otp);
        setMessage("");
        setVerify(true);
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Loggedout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <Container component="main" maxWidth="xs">
        <form onSubmit={onSubmitForm}>
          <div className={classes.paper}>
            <CssBaseline />
            <Typography component="h1" variant="h5">
              Enter the text to be sent
            </Typography>
            <TextField
              className={classes.text}
              id="outlined-textarea"
              label="Message"
              name="message"
              placeholder="Text to be encrypted"
              multiline
              variant="filled"
              value={message}
              onChange={(e) => onChange(e)}
            />

            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              type="submit"
            >
              Send
            </Button>
            <Typography component="h1" variant="h5">
              {otp}
            </Typography>

            <Link to={`/otp${token}`}>{nextpage}</Link>
            <Button
              onClick={(e) => logout(e)}
              className={classes.btn}
              variant="contained"
              color="primary"
              type="button"
            >
              Logout
            </Button>
          </div>
        </form>
      </Container>
    </Fragment>
  );
};

export default Input;
