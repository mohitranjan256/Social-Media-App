import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgMenuRightAlt } from 'react-icons/cg';
import { admminContext } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../stroe';


function Header() {
    const [showmenu, setshowmenu] = useState(false);
    const user=JSON.parse(localStorage.getItem('User'));
    const nav = useNavigate();
    const isadmin = useSelector(state => state.isadmin);
    const AdminCon=useContext(admminContext);
    const dispatch=useDispatch();
    const logined = () =>{
        if (JSON.parse(localStorage.getItem('User'))) {
          const user = JSON.parse(localStorage.getItem('User'));
          console.log(user.admin)
          if(user.admin===true){
            dispatch(authActions.login())
          }
        }
      }
      logined();
    const menuitems = [
        {
            id: 1,
            title: 'Home',
            path: '/'
        },
        {
            id: 2,
            title: 'Add Post',
            path: '/addpost'
        },
        {
            id: 3,
            title: 'Messages',
            path: '/message'
        },
        {
            id: 4,
            title: 'Profile',
            path: `/profile/${user===null ? '' : user.id}`
        },

    ]
    return (
        <div className='p-5 bg-primary rounded-lg'>
            {!showmenu && (
                <div className='md:flex justify-end hidden bg-primary -mb-8'>
                    <CgMenuRightAlt size={30} color='white' className='cursor-pointer' onClick={() => setshowmenu(true)} />
                </div>
            )}

            <div className='flex items-center justify-between text-white'>
                <h1 onClick={()=> nav('/')} className='text-2xl font-semibold'>Social Media App</h1>
                <div className='flex space-x-10 justify-end md:hidden'>
                    {
                        menuitems.map((items) => {
                            return <Link to={`${items.path}`} key={items.id} className='text-white text-500 font-semibold'>{items.title}</Link>
                        })
                    }
                    {
                        isadmin && (
                            <h1 key={78} className='text-white text-500 font-semibold' onClick={() => {
                                nav('/admin')
                                window.location.reload(false);
                            }}>Admin Control</h1>
                        )
                    }
                    <h1 key={78} className='text-white text-500 font-semibold' onClick={() => {
                        localStorage.removeItem('User');
                        dispatch(authActions.logout());
                        nav('/')
                        window.location.reload(false);
                    }}>Log Out</h1>
                </div>
                {
                    showmenu && (
                        <div className='md:flex space-x-10 justify-end flex-col items-end space-y-5'>
                            {
                                menuitems.map((items) => {
                                    return <Link to={`${items.path}`} key={items.id} className='text-white text-500 font-semibold '>{items.title}</Link>
                                })
                            }
                            <h1 onClick={() => {
                                localStorage.removeItem('User');
                                nav('/')
                            }}>Log Out</h1>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Header