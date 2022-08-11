import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './Auth.css';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import Cookies from 'js-cookie';
import { apilink } from '../../data/fdata';

const Forget = () => {
  const [email, setEmail] = useState('');

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const his = useHistory();

  const onSub = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.preventDefault();
    const res = await axios.post(`${apilink}/user/forgot`, { email });
    console.log(res.data);
    if (res.data.success) {
      setStatus(true);
      setMsg(res.data.msg);
      setEmail('');
    } else {
      setStatus(true);
      setMsg(res.data.msg);
      setEmail('');
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
                    <div class="alert alert-warning alert-dismissible">
                      <button
                        type="button"
                        class="close"
                        data-dismiss="alert"
                        onClick={() => setStatus(false)}
                      >
                        &times;
                      </button>
                      {msg}
                    </div>
                  </>
                ) : null}

                <h3 className="text-center pb-3">Forget Password</h3>
                <p className="text-center">
                  Enter Your email to get your Reset Password link
                </p>
                <br />
                <form onSubmit={onSub} className="">
                  <div class="form-group">
                    <input
                      type="email"
                      placeholder="Enter Email"
                      class="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-box">
                    <p
                      onClick={() => his.push('/login')}
                      style={{ cursor: 'pointer' }}
                    >
                      Back to Login
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className={
                        loading ? 'dis btn btn-primary' : 'btn btn-primary'
                      }
                      disabled={loading}
                    >
                      Send Now
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

export default Forget;
