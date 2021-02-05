import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { toast } from "react-toastify";
import Grid from "@material-ui/core/Grid";
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

const Otp = () => {
  const classes = useStyles();
  const [otp, setOtp] = useState("");
  const [valid, setValid] = useState(false);
  const onChange = (e) => {
    const { value } = e.target;
    setOtp(value);
  };
  const [id, setId] = useState("");

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

    const body = { id, otp };

    try {
      const response = await fetch("http://localhost:5000/auth/validateotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes) {
        toast.success("Otp Verified ");
        setValid(true);
        //setMessage("");
      } else {
        toast.error("Otp is incorrect");
        setOtp("");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const [data, setData] = useState("");
  if (valid == true) {
    const body = { otp };
    const decryption = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/decrypted", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();

        if (parseRes) {
          setData(parseRes.text);

          //setMessage("");
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    decryption();
  }
  return (
    <Fragment>
      <Container component="main" maxWidth="xs">
        <form onSubmit={onSubmitForm}>
          <div className={classes.paper}>
            <CssBaseline />
            <Typography component="h1" variant="h5">
              Enter your OTP
            </Typography>
            <TextField
              className={classes.text}
              id="outlined-textarea"
              label="OTP"
              name="message"
              placeholder="Enter OTP"
              multiline
              variant="filled"
              value={otp}
              onChange={(e) => onChange(e)}
            />

            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              type="submit"
            >
              VERIFY OTP
            </Button>

            {valid ? (
              <div>
                <Grid item xs>
                  <Typography gutterBottom variant="h4">
                    Original Message
                  </Typography>
                </Grid>
                <Typography color="textSecondary" variant="h4">
                  {data}
                </Typography>
              </div>
            ) : null}
          </div>
        </form>
      </Container>
    </Fragment>
  );
};

export default Otp;
