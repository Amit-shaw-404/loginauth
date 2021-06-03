import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { Button, Grid, Paper, TextField } from '@material-ui/core';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {Link, Redirect, useHistory, withRouter} from 'react-router-dom';
import {  InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles=makeStyles(theme=>({
  root:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    minHeight:'100vh',
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
  loginContainer:{
    display:'flex', 
    alignItems:'center', 
    flexDirection:'column'
  },
  login:{
    width:'75%', 
    display:'flex', 
    alignItems:'center', 
    flexDirection:'column', 
    margin:'20px'
  }
}))

function SignIn() {
  const classes=useStyles();

    const [details, setDetails]=useState({});
    const [emailErr, setEmailErr]=useState('');
    const [passwordErr, setPasswordErr]=useState('');
    const [access, setAccess]=useState({});
    const history=useHistory();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword); 

    const handleChange=(event)=>{
    if(event.target.name=="enail"){
        setEmailErr('');
    }else if(event.target.name=="password"){
        setPasswordErr('');
    }
    setDetails({ ...details, [event.target.name]: event.target.value });
  }
  const handleSubmit=(event)=>{
    event.preventDefault();
    axios.post("http://localhost:5000/signin",details)
    .then(res=>{
        localStorage.setItem(`token${res.data.user.username}`,res.data.token)
        setAccess(res.data.user);
        history.push(res.data.user.username);
        console.log(res);
    })
    .catch(err=>{
        if(err.response.data.message=="Invalid email id"){
          setEmailErr(err.response.data.message)
        }else if(err.response.data.message=="Incorrect password"){
            setPasswordErr("Incorrect Password");
        }
    })
  }

  // handling google signin
  const responseGoogle=(response)=>{
    console.log(response);
    axios({
      method:'POST',
      url:"http://localhost:5000/googlelogin",
      data:{tokenId:response.tokenId}
    })
    .then(res=>{
        localStorage.setItem(`token${res.data.user.username}`,res.data.token)
        setAccess(res.data.user);
        history.push(res.data.user.username);
        console.log(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  //handling facebook signin
  const responseFacebook=(response)=>{
    console.log(response);
    axios({
      method:'POST',
      url:"http://localhost:5000/facebooklogin",
      data:{accessToken:response.accessToken, userId:response.userID}
    })
    .then(res=>{
        localStorage.setItem(`token${res.data.user.username}`,res.data.token)
        setAccess(res.data.user);
        history.push(res.data.user.username);
        console.log(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  return (
    <div className={classes.root}>
    {access.username?
    <Redirect from="/" to={`/${access.username}`}/>
    :  
      <div className={classes.main}>
        <Paper className={classes.loginContainer}>
          <div className={classes.login}>
            <div>
              <GoogleLogin
                clientId="903692377365-mbeknmk2k2a4777stvv7sleqk3bpmt6t.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>
            <p>or</p>
            <div>
              <FacebookLogin
                appId="380470786782307"
                fields="name,email,picture"
                callback={responseFacebook}
              />
            </div>
            <p>or</p>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
             {emailErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{emailErr}</p>):""}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword?"text":"password"}
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
                {passwordErr!==""?(<p style={{color:'#F32013', margin:'5px 0', fontSize:'13px'}}>{passwordErr}</p>):""}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container style={{margin:'0 0 30px 0'}}>
                <Grid item>
                  <div className={classes.link}>
                    <Link to="/signup" target="_blank" rel="noopener noreferrer">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </div>
    }
    </div>
  );
}

export default withRouter(SignIn);
