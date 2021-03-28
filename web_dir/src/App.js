import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import MainPage from "./pages";
import UsersPage from "./pages/users";
import NotFoundPage from "./pages/404";
import Navbar from './components/navBar/navBar';

class App extends Component {
  render() {
    return (
        <Router>
            <Navbar />
            {/*All our Routes goes here!*/}
            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route exact path="/users" component={UsersPage} /> 
                <Route exact component={NotFoundPage} />
            </Switch>
        </Router>
    );
  }
}

export default App;