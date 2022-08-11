import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavLink, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

import { apilink } from '../../data/fdata';
import { CircularProgress } from '@material-ui/core';

const Home = () => {
  const atokon = Cookies.get('_empp_abc_access_user_tokon_');
  const history = useHistory();
  const [profile, setProfile] = useState(true);
  const [logoutstatus, setLogoutstatus] = useState(false);

  const [postimg, setPostimg] = useState([]);
  const [postprev, setPostprev] = useState(false);
  const [avatar, setAvatar] = useState(false);
  const [imgloading, setImgLoading] = useState(false);

  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [myData, setMyData] = useState([]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [pin, setPin] = useState('');
  const [street, setStreet] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [npassword, setNPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

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

  useEffect(async () => {
    const res = await axios.get(`${apilink}/auth/isVerify`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (!res.data.success) {
      history.push('/login');
    } else {
      getalldata();
    }
  }, []);

  const getalldata = async () => {
    setLoading(true);

    const res = await axios.get(`${apilink}/user/infor`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (res.data.success) {
      setMyData(res.data.user);
      setEmail(res.data.user.email);
      setName(res.data.user.name);
      setAvatar(res.data.user.profileimg);
      setCity(res.data.user.city);
      setCountry(res.data.user.country);
      setState(res.data.user.state);
      setStreet(res.data.user.street);
      setPhone(res.data.user.phone);
      setPin(res.data.user.pincode);
      setDob(res.data.user.dob);
    } else {
      notify(res.data.msg);
    }
    setLoading(false);
  };
  const logout = () => {
    setLogoutstatus(false);
    Cookies.remove('_empp_abc_access_user_tokon_');
    localStorage.removeItem('_empp_abc_access_user_login');
    console.clear();
    window.location.href = '/login';
  };
  const onsub = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      email,
      profileimg: avatar,
      phone,
      dob,
      street,
      city,
      state,
      country,
      pincode: pin,
    };

    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !street ||
      !city ||
      !pin ||
      !country
    ) {
      notify('⚠️ Please Enter all the fields');
    } else {
      const res = await axios.patch(`${apilink}/user/userallthings`, data, {
        headers: {
          Authorization: atokon,
        },
      });
      // console.log(res.data);
      if (res.data.success) {
        setMsg('Profile Update Successfully');
        setStatus(true);
      } else {
        notify(res.data.msg);
      }
    }
    setLoading(false);
  };

  const handelImg = async (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      if (
        files[0].type === 'image/jpeg' ||
        files[0].type === 'image/jpg' ||
        files[0].type === 'image/png'
      ) {
        if (files[0].size > 1024 * 1024) {
          notify('File Size is Too Large');
        } else {
          setPostimg(files[0]);
          setPostprev(true);

          setImgLoading(true);
          let formData = new FormData();
          formData.append('file', files[0]);

          const res = await axios.post(
            `${apilink}/api/upload_avatar`,
            formData,
            {
              headers: {
                'content-type': 'multipart/form-data',
                Authorization: atokon,
              },
            }
          );
          // console.log(res.data);

          if (res.data.success) {
            setAvatar(res.data.url);
          } else {
            notify(res.data.msg);
          }
          setImgLoading(false);
        }
      } else {
        notify('Only PNG, JPEG, JPG');
      }
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    if (npassword.length < 6) {
      setStatus(true);
      setMsg('Password length should be atleast 6');
    } else if (npassword != cpassword) {
      setStatus(true);
      setMsg('Both Password should be same');
    } else {
      const res = await axios.post(
        `${apilink}/user/reset`,
        {
          password: npassword,
        },
        {
          headers: {
            Authorization: atokon,
          },
        }
      );
      if (res.data.success) {
        logout();
      } else {
        setStatus(true);
        setMsg(res.data.msg);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="home">
        <div className="updiv"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12 mx-auto mb-3">
              <div className="card p-3">
                <div>
                  <div className="">
                    <div>
                      {imgloading ? (
                        <div className="text-center p-2">
                          <CircularProgress size={35} />
                        </div>
                      ) : (
                        <>
                          <img
                            src={
                              avatar
                                ? avatar
                                : 'https://res.cloudinary.com/du9emrtpi/image/upload/v1660128327/avatar/user_beo1wf.png'
                            }
                            alt="logo"
                            className="userimg d-block mx-auto"
                          />
                        </>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <label htmlFor="file">
                        <p className="textb">Upload Photo</p>
                        <input
                          style={{ display: 'none' }}
                          type="file"
                          id="file"
                          onChange={handelImg}
                          accept=".png,.jpeg,.jpg"
                        />
                      </label>
                      <div class="alert alert-warning m-3">
                        Upload New Photo. Maximum upload size
                        <strong> 2 MB</strong>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <h5 className="mtt">{name && name}</h5>
                    <span className="fontsize">
                      Member Since:{' '}
                      {myData?.joindate &&
                        new Date(myData?.joindate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-center  mt-3">
                    <div className="">
                      <div className="mb-2">
                        <div class="btn-group" onClick={() => setProfile(true)}>
                          <button type="button" class="btn btn-one">
                            <i className="fa fa-user"></i>
                          </button>
                          <button type="button" class="btn btn-one-mix">
                            View Profile
                          </button>
                        </div>
                      </div>
                      <div className="mb-2" onClick={() => setProfile(false)}>
                        <div class="btn-group">
                          <button type="button" class="btn btn-two">
                            <i className="fa fa-cog"></i>
                          </button>
                          <button type="button" class="btn btn-two-mix">
                            Account Setting
                          </button>
                        </div>
                      </div>
                      <div
                        className="mb-2"
                        onClick={() => setLogoutstatus(true)}
                      >
                        <div class="btn-group">
                          <button type="button" class="btn btn-three">
                            <i className="fa fa-sign-out"></i>
                          </button>
                          <button type="button" class="btn btn-three-mix">
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-6 col-12 mx-auto mb-3">
              <div className="card p-3">
                {profile ? (
                  <>
                    <div>
                      <div className="box">
                        <div>
                          {' '}
                          <i className="fa fa-cogs"></i> &nbsp;&nbsp; Profile
                          Information{' '}
                        </div>
                        <div>
                          <h5>{myData?._id && myData?._id.slice(0, 15)}...</h5>
                        </div>
                      </div>
                      <hr />

                      {status ? (
                        <>
                          <div class="alert alert-success alert-dismissible">
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
                      <form action="" onSubmit={onsub}>
                        <div class="form-row">
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="name"
                              placeholder="Enter Name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div class="form-group col-lg-6">
                            <input
                              type="email"
                              class="form-control"
                              name="email"
                              value={email}
                              placeholder="Enter Email"
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              readOnly
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-lg-6">
                            <input
                              type="number"
                              class="form-control"
                              name="number"
                              value={phone}
                              placeholder="Enter Number"
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="dob"
                              onFocus={(e) => (e.target.type = 'date')}
                              onBlur={(e) => (e.target.type = 'text')}
                              placeholder="Enter DOB"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="street"
                              placeholder="Enter Street"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              required
                            />
                          </div>
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="city"
                              value={city}
                              placeholder="Enter City"
                              onChange={(e) => setCity(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="state"
                              value={state}
                              placeholder="Enter State"
                              onChange={(e) => setState(e.target.value)}
                              required
                            />
                          </div>
                          <div class="form-group col-lg-6">
                            <input
                              type="text"
                              class="form-control"
                              name="country"
                              value={country}
                              placeholder="Enter Country"
                              onChange={(e) => setCountry(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Enter Pincode"
                            name="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                          />
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            className={
                              loading
                                ? 'dis btn btn-primary'
                                : 'btn btn-primary'
                            }
                            disabled={loading}
                          >
                            Update Profile
                          </button>
                          {loading && (
                            <div className="text-center p-2">
                              <CircularProgress size={35} />
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="box">
                        <div>
                          {' '}
                          <i className="fa fa-cogs"></i> &nbsp;&nbsp; Account
                          Setting
                        </div>
                        <div>
                          <h5>{myData?._id && myData?._id.slice(0, 15)}...</h5>
                        </div>
                      </div>

                      <hr />
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
                      <div className="wid">
                        <form action="" onSubmit={onUpdate}>
                          <div class="form-group">
                            <input
                              type="password"
                              class="form-control"
                              name="npassword"
                              placeholder="Enter New Password"
                              required
                              onChange={(e) => setNPassword(e.target.value)}
                            />
                          </div>
                          <div class="form-group">
                            <input
                              type="password"
                              class="form-control"
                              name="cpassword"
                              placeholder="Confirm Password"
                              onChange={(e) => setCPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="text-center">
                            <button className="btn btn-primary">
                              Update Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {logoutstatus && (
          <div className="modbox">
            <div className="smbox">
              <p>Are you sure about Logout? </p>
              <button className="btn btn-three-mix" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
