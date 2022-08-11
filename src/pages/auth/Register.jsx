import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import './Auth.css';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { apilink } from '../../data/fdata';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [npassword, setNPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coll, setColl] = useState(false);
  const [msg, setMsg] = useState('');
  const his = useHistory();

  const onSub = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (npassword.length < 6) {
      setStatus(true);
      setColl(false);
      setMsg('Password must be at least 6 characters.');
    } else if (npassword != cpassword) {
      setStatus(true);
      setMsg('Both Password should be same.');
      setColl(false);
    } else {
      const data = {
        name,
        email,
        password: npassword,
      };
      localStorage.setItem(
        '_empp_abc_access_user_user_cred',
        JSON.stringify(data)
      );
      const res = await axios.post(`${apilink}/user/register`, data);
      // console.log(res.data);
      if (res.data.success) {
        setStatus(true);
        setMsg(res.data.msg);
        setColl(true);
        setEmail('');

        setName('');
        setNPassword('');
        setCPassword('');
        // his.push('/login');
      } else {
        setStatus(true);
        setMsg(res.data.msg);
        setColl(false);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="auth">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-7 col-12 mx-auto">
              <div className="card p-3">
                {status ? (
                  <>
                    <div
                      className={
                        coll
                          ? 'alert alert-success alert-dismissible'
                          : 'alert alert-warning alert-dismissible'
                      }
                    >
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        onClick={() => setStatus(false)}
                      >
                        &times;
                      </button>
                      {msg}
                    </div>
                  </>
                ) : null}

                <h3 className="text-center pb-3">Employee Management</h3>
                <br />
                <form onSubmit={onSub} className="">
                  <div className="form-group ">
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Enter Password"
                      className="form-control"
                      name="lname"
                      value={npassword}
                      onChange={(e) => setNPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control"
                      name="cpassword"
                      value={cpassword}
                      onChange={(e) => setCPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-box">
                    <p
                      onClick={() => his.push('/login')}
                      style={{ cursor: 'pointer' }}
                    >
                      Already Have an Account?
                    </p>
                    <p></p>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className={
                        loading ? 'dis btn btn-primary' : 'btn btn-primary'
                      }
                      disabled={loading}
                    >
                      Register Now
                    </button>
                  </div>
                  {loading && (
                    <div className="text-center p-2">
                      <CircularProgress size={45} />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
