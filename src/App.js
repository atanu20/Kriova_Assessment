import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Error from './pages/Error';

import './App.css';
// import Navbar from './component/navbar/NavBar';
import NavOne from './component/navbar/NavOne';
import LoginU from './pages/auth/LoginU';
import Register from './pages/auth/Register';
import Forget from './pages/auth/Forget';
import UActivate from './pages/auth/UActivate';
import UReset from './pages/auth/UReset';

const App = () => {
  return (
    <>
      <NavOne />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={LoginU} />
        <Route exact path="/forgetemail" component={Forget} />
        <Route exact path="/user/activate/:activetoken" component={UActivate} />
        <Route
          exact
          path="/user/reset-password/:accesstoken"
          component={UReset}
        />

        <Route component={Error} />
      </Switch>
    </>
  );
};

export default App;
