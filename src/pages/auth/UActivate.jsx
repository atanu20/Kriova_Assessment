import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { apilink } from '../../data/fdata';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UActivate = () => {
  const { activetoken } = useParams();
  const userdet = JSON.parse(
    localStorage.getItem('_empp_abc_access_user_user_cred')
  );
  // console.log(userdet);
  const [loginStatus, setLoginStatus] = useState(false);
  const notify = (msg) =>
    toast.dark(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  const accountActivate = async () => {
    const res = await axios.post(`${apilink}/user/activation`, {
      activation_token: activetoken,
    });
    // console.log(res.data);

    if (res.data.success) {
      // const res = await axios.post(`${apilink}/user/activation`, userdet);
      setLoginStatus(true);
    } else {
      notify(res.data.msg);
    }
  };

  // useEffect(() => {
  //   if (activetoken) {
  //     accountActivate();
  //   }
  // }, [activetoken]);

  return (
    <>
      <ToastContainer />
      <div className="dash">
        <div className="container">
          <br />
          <br />
          <div className="row mt-5">
            <div className="col-lg-6 col-md-8 col-12 mx-auto text-center">
              {loginStatus ? (
                <>
                  <img
                    src="https://moonn-jobs.netlify.app/image/success.gif"
                    alt=""
                    width="120"
                    height="120"
                  />
                  <h4 className="text-success text-center">
                    Thank You!! Your Account has been activated
                  </h4>
                  <br />
                  <NavLink className="btn btn-primary text-white" to="/login">
                    LogIn Now
                  </NavLink>
                </>
              ) : (
                <>
                  <h4 className="text-warning text-center">
                    Click Here to Activate Your account
                  </h4>
                  <button
                    className="btn btn-three-mix text-white"
                    onClick={() => accountActivate()}
                  >
                    Click Here
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UActivate;
