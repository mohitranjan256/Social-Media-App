import React, { useState } from 'react'
import { SlLike } from "react-icons/sl";
import { FaComment } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function ProfilePosts(props) {
    const nav=useNavigate();
    const [date,setdate]=useState([props.post.time]);
    const seepost=async ()=>{
        // console.log(props.post.id);
        nav(`/posts/${props.post.id}`)
    }
    const getusername = () => {
        const email = props.post.user.email;
        let i = 0;
        for (; i < email.length; i++) {
            if (email[i] === '@') {
                break;
            }
        }
        const username = email.substr(0, i);
        // console.log(username)
        return username;
    }
    // console.log(props)
    return (
        <div key={props.post.id} onClick={seepost}>
            <div className='m-5 p-5 card rounded-sm '>
                <div className='pb-5 flex'>
                    <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                        <span className='flex flex-col justify-center items-center text-2xl pt-1'>{props.post.user.email[0].toUpperCase()}</span>
                    </div>
                    <span className='pl-5 text-2xl'>{getusername()}</span>
                </div>
                <img src={props.post.imageurl} className='' />
                <div className='flex text-center justify-start pt-2'>{props.post.description}</div>
                <div className='flex space-x-8 pt-2'>
                    <div className='flex flex-col'>
                        <SlLike size={25} />
                        <h1>{props.post.likes.length}</h1>
                    </div>
                    <div className='flex flex-col'>
                        <FaComment size={25} />
                        <h1>{props.post.comments.length}</h1>
                    </div>
                </div>
                <div className='flex justify-end text-gray-600'>
                    {/* {date} */}
                </div>
            </div>
        </div>
    )
}

export default ProfilePosts