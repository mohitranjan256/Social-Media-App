import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app, auth, firedb } from '../firebase';
import {  doc, setDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc";

function Signup() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [cnfrmpassword, setcnfrmpassword] = useState('');
  const nav = useNavigate();
  const signup = async () => {
    if (password !== cnfrmpassword) {
      alert('Password did not match');
      return;
    }
    try {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userdata = {
            admin: false,
            email: user.email,
            profilePicurl: '',
            bio: '',
            followers: [],
            id: user.uid
          }
          console.log(userdata);
          localStorage.setItem('User', JSON.stringify({ ...userdata }))
          setDoc(doc(firedb, 'Users', user.uid), userdata)
          nav('/')
          // window.location.reload(false);
        })
        .catch((error) => {
          alert(`${error}`);
        });
    }
    catch (e) {

    }
  }
  const googleauth = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const userdata = {
          admin: false,
          email: user.email,
          profilePicurl: '',
          bio: '',
          followers: [],
          id: user.uid
        }
        localStorage.setItem('User', JSON.stringify({ ...userdata }))
        setDoc(doc(firedb, 'Users', user.uid), userdata)
        nav('/')
        // window.location.reload(false);
      }).catch((error) => {
        alert(`${error}`)
      });
  }
  return (
    <div className='h-screen flex justify-center items-center bg-blue-400'>
      <div className='bg-white'>
        <div className='w-[420px] flex flex-col space-y-5 card p-10 rounded-sm'>
          <label htmlFor='email' className='text-4xl text-primary font-semibold '>Sign-up</label>
          <hr />
          <input type='text' id='email' placeholder='Enter your Email-ID' value={email} onChange={(e) => setemail(e.target.value)}
            className='border border-grey-300 h-10  rounded-sm focus:border-grey-500 pl-5' />
          <input type='password' placeholder='Enter your Password' value={password} onChange={(e) => setpassword(e.target.value)}
            className='border border-grey-300 h-10 rounded-sm focus:border-grey-500 pl-5' />
          <input type='password' placeholder='Confirm your password' value={cnfrmpassword} onChange={(e) => setcnfrmpassword(e.target.value)}
            className='border border-grey-300 h-10 rounded-sm focus:border-grey-500 pl-5' />
          <div className='flex justify-end space-x-5'>
            <button className='bg-primary h-10 rounded-sm text-white px-10' onClick={signup}>Signup</button>
            <FcGoogle size={40} onClick={googleauth} />
          </div>
          <hr />
          <Link to='/login' className='text-[14px] text-grey flex justify-center items-center'>Already Sign-up ? Click here to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup