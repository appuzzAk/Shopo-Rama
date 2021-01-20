import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import config from "../../config";
import LinearProgress from "@material-ui/core/LinearProgress";
// import ImgNotFound from '../../assets/img/logo-black-img-not-found.png';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Grid } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

const BACKEND_URL = config.backend.host;

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: "50%",
    backgroundColor: "#FAFAFA",
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
  imgSize: {
    width: "50px",
  },
  fab: {
    margin: theme.spacing(3),
    height: "10%",
    width: "3%",
    color: "white",
    backgroundColor: "#F6227F",
    "&:hover": {
      color: "white !important",
      backgroundColor: "#c41b63 !important",
    },
    borderRadius: 5,
  },
  button: {
    margin: 10,
  },
  extendedIcon: {
    marginRight: theme.spacing(),
  },
  select: {
    width: "200px",
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#ededed",
    color: "black",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class UserList extends Component {
  _isMounted = false;

  state = {
    users: [],
    checkedA: true,
    checkedB: true,
    name: [],
    loading: true,
    checked: false,
    openDeleteDialog: false,
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleSuspendedChange(suspended, id) {
    const token = localStorage.getItem("token");
    console.log("Users: ", suspended, id);
    if (suspended) {
      axios
        .get(BACKEND_URL + `Account/Users/${id}/suspend/false`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Users: ", response);
          this.listUsers();
        })
        .catch(function (error) {
          console.log(error);
          //TODO: Show errors with snackbars
        });
    } else {
      axios
        .get(BACKEND_URL + `Account/Users/${id}/suspend/true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Users: ", response);
          this.listUsers();
        })
        .catch(function (error) {
          console.log(error);
          //TODO: Show errors with snackbars
        });
    }
  }

  handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
  };

  componentDidMount() {
    this._isMounted = true;
    console.log("componentDidMount");
    this.listUsers();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  listUsers() {
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + `Account/Users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (this._isMounted) {
          console.log("Users: ", response);
          const result = response.data.users.filter(
            (b) => b.userName !== "Admin"
          );
          this.setState({
            users: result,
            loading: false,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        //TODO: Show errors with snackbars
      });
  }

  getStyles(name, that) {
    return {
      fontWeight:
        that.state.name.indexOf(name) === -1
          ? that.props.theme.typography.fontWeightRegular
          : that.props.theme.typography.fontWeightMedium,
    };
  }

  btnDeleteOnClick(id, e) {
    this.setState({
      deleteId: id,
      openDeleteDialog: true,
    });
  }

  proceedDelete() {
    const token = localStorage.getItem("token");
    axios
      .delete(BACKEND_URL + `Account/Users/${this.state.deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(this.updateStateAfterDelete(this.state.deleteId))
      .catch(function (error) {
        console.log(error);
        //TODO: Show errors with snackbars
      });
    this.setState({
      deleteId: "",
      openDeleteDialog: false,
    });
  }

  updateStateAfterDelete(id) {
    console.log("Deleted!");
    this.setState({
      users: this.state.users.filter((b) => b.id !== id),
    });
  }

  cancelDelete() {
    this.setState({
      deleteId: "",
      openDeleteDialog: false,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid
          align="center"
          justify="space-evenly"
          container
          alignItems="center"
        >
          <Grid xs={8}>
            <Typography variant="h4">Users</Typography>
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* <StyledTableCell>Profile Picture</StyledTableCell> */}
              <StyledTableCell>UserName</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Suspended Status</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.users.map((user) => (
              <TableRow className={classes.row} key={user._id}>
                {/* <CustomTableCell align="left">
                  <img
                    alt=""
                    className={classes.imgSize}
                    src={
                      user.picture
                        ? user.picture
                        : "https://www.motorolasolutions.com/content/dam/msi/images/products/accessories/image_not_available_lg.jpg"
                    }
                  />
                </CustomTableCell> */}
                <CustomTableCell align="left">{user.userName}</CustomTableCell>
                <CustomTableCell align="left">{user.firstName}</CustomTableCell>
                <CustomTableCell align="left">{user.lastName}</CustomTableCell>
                <CustomTableCell align="left">{user.email}</CustomTableCell>
                <CustomTableCell align="left">
                  {user.phoneNumber}
                </CustomTableCell>
                <CustomTableCell align="left">
                  <Switch
                    checked={user.isSuspended}
                    onChange={() =>
                      this.handleSuspendedChange(user.isSuspended, user.id)
                    }
                    name="checked"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </CustomTableCell>
                <CustomTableCell align="left">
                  {/* <Tooltip title="Edit User" aria-label="Edit">
                    <IconButton
                      aria-label="Edit"
                      className={classes.margin}
                      component={Link}
                      to={`/user/edit/${user._id}`}
                    >
                      <EditIcon fontSize="small" style={{ color: "#F6277F" }} />
                    </IconButton>
                  </Tooltip> */}
                  {/* <Tooltip title="Delete User" aria-label="Delete">
                    <IconButton
                      aria-label="Delete"
                      className={classes.margin}
                      onClick={this.btnDeleteOnClick.bind(this, user.id)}
                    >
                      <DeleteIcon
                        fontSize="small"
                        style={{ color: "#F6277F" }}
                      />
                    </IconButton>
                  </Tooltip> */}
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {this.state.loading ? <LinearProgress /> : ""}
        <Dialog
          open={this.state.openDeleteDialog}
          onClose={this.cancelDelete.bind(this)}
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete.bind(this)} color="primary">
              No
            </Button>
            <Button
              onClick={this.proceedDelete.bind(this)}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(UserList);
