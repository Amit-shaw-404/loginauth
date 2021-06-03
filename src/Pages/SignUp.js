import React, { useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import axios from "axios";
import {  InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    width:"100%",
  },
  main:{
    width:'25%',
    [theme.breakpoints.only("md")]:{
      width:'40%',
    },
    [theme.breakpoints.only("sm")]:{
      width:'50%',
    },
    [theme.breakpoints.only("xs")]:{
      width:'100%',
    }
  },
  nav: {
    backgroundColor: "#f8f8ff",
    marginBottom: "20px"
  },
  active: {
    backgroundColor: "#fff",
    zIndex: "2"
  },
  form: {
    width: "90%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(4, 0, 6)
  },
  link:{
    textDecoration:'underline',
    color:'blue',
    fontSize:'20px',
    padding:'5px',
    cursor:'pointer',
    marginBottom:"30px"
  }
}));
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);


export default function SignUp() {
  const classes = useStyles();
  const [emailErr, setEmailErr]=useState("");
  const [details, setDetails]=useState({});
  const [success, setSuccess]=useState("");
  const [confirmPassword, setConfirmPassword]=useState('');
  const [usernameErr, setUsernameErr]=useState('');
  const [firstnameErr, setFirstnameErr]=useState('');
  const [passwordErr, setPasswordErr]=useState('');
  const [showpass, setShowpass]=useState(false);
  const [confirm, setConfirm]=useState(false);

  const signUpRequest=()=>{
    axios.post("https://backend1authentication.herokuapp.com/signup",details)
    .then(res=>{
        setSuccess("Email has been sent to the mail id, please verify it");
    })
    .catch(err=>{
        if(err.response.data.message=="Email already taken" || err.response.data.message=="Error in sending message"){
          setEmailErr(err.response.data.message)
        }else{
          setUsernameErr("Username already taken");
        }
    })
  }

  const handleChange=(event)=>{
    if(event.target.name=="username"){
      setUsernameErr('');
    }else if(event.target.name=="firstname"){
      setFirstnameErr('');
    }
    if(event.target.name=="username"){
      setDetails({ ...details, [event.target.name]: event.target.value.toLowerCase()});
    }else{
      setDetails({ ...details, [event.target.name]: event.target.value });
    }
  }

  const handlePassword=()=>{setShowpass(!showpass)}
  const handleConfirm=()=>{setConfirm(!confirm)}

  const checkDot=()=>{
    for(let i=0;i<details.username.length-1;i++){
      if(details.username[i]=='.'&&details.username[i+1]=='.'){
        return true;
      }
    }
    return false;
  }
  const checkAlphabet=()=>{
    for(let i=0;i<details.username.length;i++){
      if((/[a-zA-Z]/).test(details.username[i])){
        return false;
      }
    }
    return true;
  }

  const validateForm=(e)=>{
    e.preventDefault();
    if(details.username[0]=='.'){
      setUsernameErr("Username cannot start with '.' or '_' ");
    }else if(details.username.length<3){
      setUsernameErr("Username cannot be less than 3");
    }else if(details.username.length>30){
      setUsernameErr("Username cannot be greater than 20");
    }else if(checkDot()){
      setUsernameErr("Username cannot contain two '.' in row");
    }else if(checkAlphabet()){
      setUsernameErr("Username should contain atleast 1 alphabet");
    }else if(details.password!=confirmPassword){
      setPasswordErr("Password do not match");
    }else if(details.firstname.length<3){
      setFirstnameErr("Firstname should be atleast 3 characters long")
    }else{
      signUpRequest();
    }
  }
  return (
    <div style={{display:'flex', justifyContent:"center", height:'100vh', alignItems:'center'}}>
      {success!==""?
        <Typography variant="h5">{success}</Typography>
        :
        <Paper className={classes.main}>
        <div className={classes.paper}>
          <form className={classes.form} onSubmit={(e)=>validateForm(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(e)=>handleChange(e)}
              autoFocus
            />
            {emailErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{emailErr}</p>):""}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Id"
              label={"Username"}
              name="username"
              onChange={(e)=>handleChange(e)}
            />
            {usernameErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{usernameErr}</p>):""}
            <TextField  
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showpass?"text":"password"}
              id="password"
              onChange={(e)=>handleChange(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePassword}
                    >
                      {confirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField  
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmpassword"
              label="Confirm Password"
              type={confirm?"text":"password"}
              id="confirm_password"
              onChange={(e)=>{setConfirmPassword(e.target.value); setPasswordErr('')}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleConfirm}
                    >
                      {confirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {passwordErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{passwordErr}</p>):""}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="firstname"
              onChange={(e)=>handleChange(e)}
            />
            {firstnameErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{firstnameErr}</p>):""}
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              onChange={(e)=>handleChange(e)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Paper>
      }
    </div>
  );
}