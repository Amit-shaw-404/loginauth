import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Profile from './Pages/Profile';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';

export default function App(){
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignIn}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/:username" component={Profile}/>
      </Switch>
    </BrowserRouter>
  );
}