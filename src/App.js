import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import React, { Suspense, lazy, useState } from 'react';
import Message from './pages/Message';
import Adminupdate from './admin/Adminupdate';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './stroe';
import Error from './pages/Error';

export const admminContext = React.createContext();

const Home = lazy(() => import('./pages/Home'))
const Addposts = lazy(() => import('./pages/Addposts'))
const PostDescp = lazy(() => import('./pages/PostDescp'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminPower = lazy(() => import('./admin/AdminPower'))

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))


function Protection(props) {
  if (JSON.parse(localStorage.getItem('User'))) {
    const user = JSON.parse(localStorage.getItem('User'));
    // logined();
    return <>{props.children}</>
  }
  else {
    return <Navigate to='/login' />;
  }
}

function Loader(){
  return (
    <div className='h-[100vh] bg-blue-400 w-full'>
      <div className='absolute top-1/3 left-1/3 text-black text-7xl font-bold'>
          Loading...
      </div>
    </div>
  )
}

function Return (props) {
  if (!JSON.parse(localStorage.getItem('User'))) {
    return <>{props.children}</>
  }
  else{
    return <><Error/></>
  }

}

function App() {
  const [adminpower, setAdminpower] = useState(false);
  const dispatch = useDispatch();
  const power = {
    admin: adminpower,
    changeAdminPower: setAdminpower
  }
  const user = JSON.parse(localStorage.getItem('User'));
  const isadmin = useSelector(state => state.isadmin);
  const logined = () => {
    if (JSON.parse(localStorage.getItem('User'))) {
      const user = JSON.parse(localStorage.getItem('User'));
      console.log(user.admin)
      if (user.admin === true) {
        dispatch(authActions.login())
      }
    }
  }
  logined();
  return (
    <div className="App">
      
      <BrowserRouter>
        <Suspense fallback={<Loader/>}>
          <admminContext.Provider value={power}>
            <Routes>
              <Route path='/' element={<Protection><Home /></Protection>} />
              <Route path='/addpost' element={<Protection><Addposts /></Protection>} />
              <Route path='/posts/:id' element={<Protection><PostDescp /></Protection>} />
              <Route path='/message' element={<Protection><Message /></Protection>} />
              <Route path='/profile/:id' element={<Protection><Profile /></Protection>} />
              <Route path='/*' element={<Protection><Error /></Protection>} />
              {isadmin && <Route path='/admin' element={<Protection><AdminPower /></Protection>} />}
              {isadmin && <Route path='/admin/post/:id' element={<Protection><Adminupdate /></Protection>} />}
              <Route path='/login' element={<Return><Login /></Return>} />
              <Route path='/signup' element={<Return><Signup /></Return>} />
              <Route path='/*'  element={<Return><Navigate to='/login' /></Return>}/>
            </Routes>
          </admminContext.Provider>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}



export default App;
