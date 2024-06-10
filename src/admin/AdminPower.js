import React, { useEffect, useState } from 'react'
import Default from '../components/Default'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, firedb } from '../firebase';
import { MdDelete, MdDeleteOutline, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GrPowerReset } from "react-icons/gr";
import { deleteUser } from 'firebase/auth';


function AdminPower() {
    const [posts, setposts] = useState([]);
    const [users, setuser] = useState([])
    const admin = JSON.parse(localStorage.getItem('User'))
    const nav=useNavigate();
    const getposts = async () => {
        const query = await getDocs(collection(firedb, 'Posts'));
        const temp = []
        query.forEach((item) => {
            temp.push({ ...item.data(), id: item.id })
        })
        temp.sort(function(x, y){
            return x.time - y.time;
        })
        temp.reverse();
        setposts(temp);
    }
    const handlepost = (postid) => {
        nav(`/admin/post/${postid}`)
    }
    const getuser = async () => {
        const query = await getDocs(collection(firedb, 'Users'));
        const temp = []
        query.forEach((item) => {
            temp.push({ ...item.data() })
        })
        setuser(temp);
        // console.log(posts)
    }
    const getusername = (data) => {
        const email = data.email;
        let i = 0;
        for (; i < email.length; i++) {
            if (email[i] === '@') {
                break;
            }
        }
        const username = email.substr(0, i);
        console.log(username)
        return username;
    }
    useEffect(() => {
        getposts();
        getuser();
    }, [])
    return (
        <div>
            <Default>
                <div className='flex space-x-5'>
                    <div className='flex w-[500vh]'>
                        <div className='flex flex-col'>
                            <div className='flex flex-col'>
                                <div className='text-2xl font-semibold text-white'>User</div>
                                <hr />
                                <div className='overflow-y-auto'>
                                    {
                                        users && (
                                            users.map((item) => {
                                                // console.log(item)
                                                return (
                                                    <div className='pb-5 flex flex-col mt-3 content border-2 rounded-md p-5 border-black overflow-x-hidden'>
                                                        <div className='flex'>
                                                            <div className='flex'>
                                                                <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                                                                    <span className='flex flex-col justify-center items-center text-2xl pt-1'>{item.email[0].toUpperCase()}</span>
                                                                </div>
                                                                <span className='pl-5 text-xl font-semibold '>{getusername(item)}</span>
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col space-x-5'>
                                                            <div className=' pl-[60px] flex space-x-5 text-lg'>
                                                                Email ID : {item.email}
                                                            </div>
                                                            <div className=' pl-[40px] flex space-x-5 text-lg'>
                                                                Bio : {item.bio.length == 0 ? 'No Bio' : item.bio}
                                                            </div>
                                                            <div className=' pl-[40px] flex space-x-5 text-lg'>
                                                                Followers : {item.followers.length == 0 ? 'No Followers' : item.followers.length}
                                                            </div>
                                                            <div className='text-lg pl-[40px]'>
                                                                Profile Picture :
                                                                {item.profilePicurl.length != 0 ? <img src={item.profilePicurl} alt='User Profile' className='h-50 w-50' /> : ' No Profile Pic'}
                                                            </div>
                                                        </div>

                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-2xl text-white'>Posts</h1>
                        <hr />
                        <div className='grid grid-cols-2 pt-4'>
                            {
                                posts && (
                                    posts.map((item) => {
                                        return (
                                            <div className='pb-4 pr-4'>
                                                <div className='content border-2 rounded-xl border-black p-5 '>
                                                    <img src={item.imageurl} alt='Posted' />
                                                    <div>Description : {item.description}</div>
                                                    <div>No of Likes : {item.likes.length}</div>
                                                    <div>No of Comments : {item.comments.length}</div>
                                                    <div>Posted by : {getusername(item.user)}</div>
                                                    <div>Posted person email id : {item.user.email}</div>
                                                    <div className='flex justify-end space-x-4'>
                                                        <GrPowerReset onClick={()=>{
                                                            updateDoc(doc(firedb,'Posts',item.id),{
                                                                likes : [],
                                                                comments : []
                                                            })
                                                            getposts();
                                                        }} size={35}/>
                                                        <MdDelete onClick={()=>{
                                                            deleteDoc(doc(firedb,'Posts',item.id))
                                                            getposts();
                                                        }} size={35}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
            </Default>
        </div>
    )
}

export default AdminPower