import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {
  Join, 
  Signup,
  SignupApplication,
  Home,
  Membership,
  Admin
} from './pages'
import './App.scss';

class App extends Component 
{

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path = "/" component = {Join}/>
                    <Route exact path = "/signup" component = {Signup}/>
                    <Route exact path = "/signup-application" component = {SignupApplication}/>
                    <Route exact path = "/home" component = {Home}/>
                    <Route exact path = "/membership" component = {Membership}/>
                    <Route exact path = "/admin" component = {Admin}/>
                </Switch>
            </Router>
        );
    }
}

export default App;