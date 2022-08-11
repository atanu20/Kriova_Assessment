import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';
import Cookies from 'js-cookie';

const NavOne = () => {
  const login = localStorage.getItem('_bill_access_user_login');
  const [status, setStatus] = useState(false);
  useEffect(() => {
    if (login) {
      setStatus(true);
    }
  }, []);

  const logout = () => {
    Cookies.remove('_bill_access_user_tokon_');
    localStorage.removeItem('_bill_access_user_login');
    console.clear();
    window.location.href = '/login';
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand text-custom font-weight-bold">
          Krio
          <span class=" dot ">va</span>
        </NavLink>

        <button className="btn btn-primary">Get Started</button>
      </nav>
    </>
  );
};

export default NavOne;
