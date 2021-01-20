import React from "react";
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  Container,
  CircularProgress,
} from "@material-ui/core";
import { Face, Fingerprint } from "@material-ui/icons";
import axios from "axios";
import config from "../../config";

const BACKEND_URL = config.backend.host;

const styles = (theme) => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  containerStyle: {
    paddingTop: "150px",
  },
  paperStyle: {
    padding: "25px",
  },
});

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    loggingin: false,
  };

  btnSignInOnClick() {
    this.setState({ loggingin: true });
    console.log("response");
    const obj = {
      EmailOrUsername: this.state.username,
      Password: this.state.password,
      Code: "string",
    };
    axios
      .post(BACKEND_URL + `Account/Login`, obj)
      .then((response) => {
        console.log(response);
        this.setState({ loggingin: false });
        this.loginSuccess(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ loggingin: false });
        this.loginError(err);
      });
  }

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  loginSuccess(data) {
    axios.defaults.headers.common["Authorization"] = data.token;
    localStorage.setItem("token", `${data.token}`);
    this.props.cbLoginSuccess(false);
  }

  loginError(err) {
    let msg = "";
    if (err.response) {
      msg = " \nServer Message: " + err.response.statusText;
    }
    alert(err + msg);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#F0F0F0",
        }}
      >
        <Container maxWidth="sm" className={classes.containerStyle}>
          <Paper className={classes.paperStyle}>
            <Grid container justify="center">
              <img
                src="https://i.ibb.co/CzRSs6s/SC.png"
                alt="Logo"
                width="300"
                height="300"
              />
            </Grid>
            <div className={classes.margin}>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <Face />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="username"
                    label="Username"
                    type="email"
                    value={this.state.username}
                    onChange={this.handleChange("username")}
                    fullWidth
                    autoFocus
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <Fingerprint />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="Password"
                    label="Password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              {!this.state.loggingin ? (
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ textTransform: "none" }}
                    onClick={() => this.btnSignInOnClick()}
                  >
                    Login
                  </Button>
                </Grid>
              ) : (
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                  <CircularProgress />
                </Grid>
              )}
            </div>
          </Paper>
        </Container>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
