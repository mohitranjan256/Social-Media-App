import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, auth, firedb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { admminContext } from '../App';
import { authActions } from '../stroe';


function Login() {
  const AdminCon = useContext(admminContext);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const nav = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('User')) {
      nav('/');
    }
  })
  const getdomain = (email) => {
    let i = 0;
    while (i < email.length) {
      if (email[i] != '@') {
        break;
      }
      i++;
    }
    let st = '';
    for (let j = i + 1; j < email.length; j++) {
      if (email[j] == '.') {
        break;
      }
      st += email[j];
    }
    return st;
  }
  let domain;
  function handlemail(e) {
    const re = /\S+@\S+\.\S+/;
    if (e.target.value.trim().length === 0) {
      e.target.setCustomValidity(
        "Input feild must contain something"
      )
      e.target.reportValidity();
    }
    else if (!re.test(e.target.value)) {
      e.target.setCustomValidity(
        "Invalid Email ID"
      )
      e.target.reportValidity();
    }
    else {
      e.target.setCustomValidity(
        ""
      )
      e.target.reportValidity();
    }
    setemail(e.target.value);
  }
  function handlePassword(e) {
    if (!(/[A-Z]/.test(e.target.value))) {
      e.target.setCustomValidity(
        "Password must contain one Uppercase"
      )
      e.target.reportValidity();
    }
    else if (!/[a-z]/.test(e.target.value)) {
      e.target.setCustomValidity(
        "Password must contain one Lowercase"
      )
      e.target.reportValidity();
    }
    else if (!/[0-9]/.test(e.target.value)) {
      e.target.setCustomValidity(
        "Password must contain one number"
      )
      e.target.reportValidity();
    }
    else if (!/[!@#$%&]/.test(e.target.value)) {
      e.target.setCustomValidity(
        "Password must contain one Special Character"
      )
      e.target.reportValidity();
    }
    else {
      if (e.target.value.trim() < 8) {
        e.target.setCustomValidity(
          "Password minimum length should be 8"
        )
      }
      else if (e.target.value.trim() > 32) {
        e.target.setCustomValidity(
          "Password maximum length be 32"
        )
      }
      else {
        e.target.setCustomValidity(
          ""
        )
      }
      e.target.reportValidity();
    }
    setpassword(e.target.value);
    // console.log(pass.Password);
  }
  const login = async () => {
    
    try {
      const auth = getAuth(app);
      domain = getdomain(email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          getDoc(doc(firedb, 'Users', user.uid)).then((user) => {
            localStorage.setItem('User', JSON.stringify({ ...user.data() }))
            nav('/')
            // window.location.reload(false)
          })
        })
        .catch((error) => {
          alert('Invalid Password or Invalid Email id or User is not Present')
        });
    }
    catch (e) {
    }
  }
  
  // window.location.reload(false);
  const googleauth = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const userp = result.user;
        getDoc(doc(firedb, 'Users', userp.uid)).then((user) => {
          localStorage.setItem('User', JSON.stringify({ ...user.data() }))
          nav('/')
          // window.location.reload(false);
        })
      }).catch((error) => {
      });
  }
  return (
    <div className='h-screen flex justify-center items-center bg-blue-400'>
      <div className='bg-white'>
        <div className='w-[420px] flex flex-col space-y-5 card p-10 rounded-sm'>
          <label htmlFor='email' className='text-4xl text-primary font-semibold '>Login</label>
          <hr />
          <input id='email' type='text' placeholder='Enter your Email-ID' value={email} onChange={handlemail}
            className='border border-grey-300 h-10  rounded-sm focus:border-grey-500 pl-5' />
          <input type='password' placeholder='Enter your Password' value={password} onChange={handlePassword}
            className='border border-grey-300 h-10 rounded-sm focus:border-grey-500 pl-5' />
          <div className='flex justify-end space-x-5'>
            <button className='bg-primary h-10 rounded-sm text-white px-10 ' onClick={login}>Login</button>
            <FcGoogle size={40} onClick={googleauth} />
          </div>
          <hr />
          <Link to='/signup' className='text-[14px] text-grey flex justify-center items-center'>Not yet Sign-up ? Click here to Signup</Link>
        </div>
      </div>
    </div>
  )
}

export default Login