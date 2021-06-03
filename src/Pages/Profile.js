import axios from "axios";
import { useEffect, useState } from "react";
import { withRouter, useHistory } from "react-router";
import {makeStyles} from '@material-ui/core/styles';
import {Avatar, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles=makeStyles(theme=>({
    root:{
      display:'flex',
      justifyContent:'center',
    },
    container:{
      width:'50%',
      marginTop:'50px',
      padding:'25px',
      [theme.breakpoints.only('md')]:{
        width:'60%',
        padding:'20px',
        marginTop:'40px',
      },
      [theme.breakpoints.only('sm')]:{
        width:'75%',
        padding:'15px',
        marginTop:'25px',
      },
      [theme.breakpoints.only('xs')]:{
        width:'100%',
        padding:'10px',
        margin:'0',
      },
      boxSizing:'border-box',
      minHeight:'80vh'
    },
    wall:{
        width:'100%',
        height:'200px',
        backgroundColor:'#000',
        "&:hover":{
            backgroundColor:"black",
        },
    },
    img:{
        position:"relative", 
        bottom:'50px'
    },
    heading:{
        fontSize:'1.2rem',
        fontWeight:'600'
    },
    about:{
    },
    main:{
        display:'flex',
    }
  }))

function Profile(){
    const history=useHistory();
    const username=history.location.pathname.replace("/", "");
    const [access, setAccess]=useState(false);
    const [user, setUser]=useState({});
    const [msg, setMsg]=useState('Please wait, loading...');
    const [openimg, setOpenimg]=useState(false);
    const [openwall, setOpenwall]=useState(false);
    const [img, setImg]=useState('');
    const [wall, setWall]=useState('');
    const [edit, setEdit]=useState(false);
    const [content, setContent]=useState('');

    useEffect(()=>{
        const request=async()=>{
            axios.get("https://backend1authentication.herokuapp.com/profile", {
                headers:{
                    "x-access-token":localStorage.getItem(`token${username}`),
                }
            }).then(res=>{
                axios.post("https://backend1authentication.herokuapp.com/", {username:username})
                .then(response=>{
                    setUser(response.data);
                    setContent(response.data.bio);
                })
                .catch(err=>{
                    console.log('something went wrong');
                })
                setAccess(true);
            }).catch(err=>{
                setMsg("Session expired, please login again!");
            })
        }
        request();
    }, [])


    const handleOpenimg=()=>{
        setOpenimg(true);
    }
    const handleOpenwall=()=>{
        setOpenwall(true);
    }
    const handleCloseimg=()=>{
        setOpenimg(false);
    }
    const handleClosewall=()=>{
        setOpenwall(false);
    }

    const handleBio=()=>{
        setEdit(false);
        const data={firstname:user.firstname, lastname:user.lastname, email:user.email, password:user.password, username:user.username, img:user.img, wallimg:user.wallimg, bio:content}
        axios.post("https://backend1authentication.herokuapp.com/update", {data:data})
        .then(response=>{
            setUser(response.data);
            console.log(response);
        })
    }
    const handleContent=(e)=>{
        setContent(e.target.value);
    }

    const uploadImg=()=>{
        handleCloseimg();
        const formdata=new FormData();
        formdata.append('file', img);
        formdata.append('upload_preset', 'imgupload');
        axios.post("https://api.cloudinary.com/v1_1/amit-cloudinary/image/upload", formdata)
        .then(res=>{
            console.log(res);
            const data={firstname:user.firstname, lastname:user.lastname, email:user.email, password:user.password, username:user.username, img:res.data.url, wallimg:user.wallimg, bio:user.bio}
            axios.post("https://backend1authentication.herokuapp.com/update", {data:data})
            .then(response=>{
                setUser(response.data);
            })
        })
    }
    const uploadWall=()=>{
        handleClosewall();
        const formdata=new FormData();
        formdata.append('file', wall);
        formdata.append('upload_preset', 'wallupload');
        axios.post("https://api.cloudinary.com/v1_1/amit-cloudinary/image/upload", formdata)
        .then(res=>{
            console.log(res);
            const data={firstname:user.firstname, lastname:user.lastname, email:user.email, password:user.password, username:user.username, img:user.img, wallimg:res.data.url}
            axios.post("https://backend1authentication.herokuapp.com/update", {data:data})
            .then(response=>{
                setUser(response.data);
               
            })
        })
    }

    const classes=useStyles();
    return(
        <div>
            {!access?
                <h2>{msg}</h2>
                :
                <div className={classes.root}>
                    <Paper className={classes.container}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <Button onClick={handleOpenwall} className={classes.wall}>
                            <Avatar variant="square" alt={user.username} src={user.wallimg} style={{height:'200px', width:'auto', maxWidth:'100%', margin:'0px', padding:'0px'}}/>
                        </Button>
                        <IconButton onClick={handleOpenimg} className={classes.img}>
                            <Avatar alt={user.username} src={user.img} style={{width:'100px', height:'100px',}}>
                            </Avatar>
                        </IconButton>
                        </div>
                        <Grid container style={{width:'100%'}}>
                            <Grid item xs={12} md={6} style={{margin:'15px 0'}}>
                                <p><span className={classes.heading}>Name : </span>{" "+user.firstname+" "+user.lastname}</p>
                                <p><span className={classes.heading}>Email Id : </span>{" "+user.email}</p>
                                <p><span className={classes.heading}>Username : </span>{" "+user.username}</p>
                            </Grid>
                            <Grid xs={12} md={5} style={{margin:'0'}}>
                                <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                                    <h3>Bio</h3>
                                    <IconButton onClick={()=>setEdit(!edit)}>
                                        <EditIcon/>
                                    </IconButton>
                                </div>
                                <Divider style={{width:'100%'}}/>
                                {edit?
                                    <div>
                                        <textarea style={{width:'100%', minHeight:'100px'}} onChange={(e)=>handleContent(e)} defaultValue={content}/>
                                        <Button style={{backgroundColor:'blue', color:'white'}} onClick={handleBio}>Update</Button>
                                    </div>
                                    :
                                    <div>
                                        <p>{user.bio}</p>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            }
            <Dialog
                open={openimg}
                onClose={handleCloseimg}
            >
                <DialogTitle id="responsive-dialog-title">Change profile picture</DialogTitle>
                <DialogContent>
                    <input onChange={(e)=>setImg(e.target.files[0])} type="file" name="myImage" accept="image/png, image/gif, image/jpeg" />
                    <div style={{margin:'20px 0'}}>
                        <Button onClick={uploadImg} style={{backgroundColor:'blue', color:'#fff'}}>Upload</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={openwall}
                onClose={handleClosewall}
            >
                <DialogTitle id="responsive-dialog-title">Change wall picture</DialogTitle>
                <DialogContent>
                    <input onChange={(e)=>setWall(e.target.files[0])} type="file" name="myImage" accept="image/png, image/gif, image/jpeg" />
                    <div style={{margin:'20px 0'}}>
                        <Button onClick={uploadWall} style={{backgroundColor:'blue', color:'#fff'}}>Upload</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default withRouter(Profile);