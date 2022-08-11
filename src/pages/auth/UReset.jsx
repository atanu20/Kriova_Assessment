import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { apilink } from '../../data/fdata';

const UReset = () => {
  const [npassword, setNPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const his = useHistory();
  const { accesstoken } = useParams();
  const onSub = async (e) => {
    e.preventDefault();
    if (npassword === cpassword) {
      const res = await axios.post(
        `${apilink}/user/reset`,
        { password: npassword },
        {
          headers: {
            Authorization: accesstoken,
          },
        }
      );
      if (res.data.success) {
        his.push('/login');
        // window.location.href = '/user/auth';
      } else {
        setStatus(true);
        setMsg(res.data.msg);
      }
    } else {
      setStatus(true);
      setMsg('Password Not Match');
    }
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

                <h3 className="text-center pb-3">Reset Password</h3>

                <br />
                <form onSubmit={onSub} className="">
                  <div class="form-group">
                    <input
                      type="password"
                      placeholder="New Password"
                      class="form-control"
                      name="lname"
                      value={npassword}
                      onChange={(e) => setNPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      class="form-control"
                      name="lname"
                      value={cpassword}
                      onChange={(e) => setCPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className={
                        loading ? 'dis btn btn-primary' : 'btn btn-primary'
                      }
                      disabled={loading}
                    >
                      Reset Password
                    </button>
                  </div>
                  {loading && (
                    <div className="text-center p-2">
                      <CircularProgress size={35} />
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

export default UReset;
