import React, { useState, useEffect } from 'react'
import Default from '../components/Default'
import { useParams } from 'react-router-dom'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { firedb } from '../firebase';
import Post from '../components/Post';
import { SlLike } from "react-icons/sl";
import { FaComment } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";

function PostDescp() {
    const [postdetail, setpostdetail] = useState(null)
    const [showlikes, setshowlikes] = useState(false)
    const [already, setalreadylike] = useState(false)
    const [comment, setcomment] = useState(false);
    const [postcomment, setpostcomment] = useState('');
    const [showcomment, setshowcomment] = useState(false);
    const [editdesp, seteditdesp] = useState(false);
    const [changedesp, setchangedesp] = useState('');
    const curruser = JSON.parse(localStorage.getItem('User'));
    const params = useParams();
    const nav = useNavigate();
    const navprofile = () => {
        nav(`/profile/${postdetail.user.id}`)
    }

    const getpostdetail = async () => {
        getDoc(doc(firedb, 'Posts', params.id)).then((resp) => {
            setpostdetail({ ...resp.data(), id: resp.id });
            if (resp.data().likes.find((user) => user.id === curruser.id)) {
                setalreadylike(true);
            }
            else {
                setalreadylike(false)
            }
            // console.log(resp.data());
        }).catch(() => {

        })
    }
    useEffect(() => {
        getpostdetail();
    }, [])
    const likeorunlike = () => {
        let updatedlikes = postdetail.likes;
        if (already) {
            updatedlikes = postdetail.likes.filter((user) => user.id !== curruser.id)
        }
        else {
            updatedlikes.push({
                id: curruser.id,
                email: curruser.email
            })
        }
        setDoc(doc(firedb, 'Posts', params.id), { ...postdetail, likes: updatedlikes }).then(() => {
            getpostdetail();
        })
    }
    const handlecomment = () => {
        let updatedcomment = postdetail.comments;
        updatedcomment.push({

            id: curruser.id,
            email: curruser.email,
            usercomment: postcomment

        })
        setDoc(doc(firedb, 'Posts', params.id), { ...postdetail, comments: updatedcomment }).then(() => {
            setpostcomment('');
            setcomment(false);
            getpostdetail();
        })
    }
    const postdel = () => {
        deleteDoc(doc(firedb, 'Posts', params.id));
        nav(`/`);
    }
    const hanldepostcoment = () => {
        setshowcomment(false);
        setshowlikes(false)
        setcomment(true);
    }
    const handleshowcommnt = () => {
        setshowcomment(true);
        setshowlikes(false)
        setcomment(false);
    }
    const handleshowlikes = () => {
        setshowcomment(false);
        setshowlikes(true)
        setcomment(false);
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
    const handleedit = () => {
        seteditdesp(true);
    }
    const submitchangedesp = () => {
        setDoc(doc(firedb, 'Posts', params.id), { ...postdetail, description: changedesp }).then(() => {
            alert('Description Updated')
            seteditdesp(false);
            getpostdetail();
            setchangedesp('');
        })
    }

    return (
        <div>
            <Default>
                <div className='w-full flex justify-center items-center space-x-5'>
                    {
                        postdetail && (
                            <>
                                {
                                    showlikes && (

                                        <div className='w-96 -ml-[50px]'>
                                            <div className='mb-5 font-semibold text-2xl flex justify-between'>
                                                <h1>People who likes the Post</h1>
                                                <IoIosCloseCircleOutline onClick={() => setshowlikes(false)} />
                                            </div>
                                            <hr />
                                            {
                                                postdetail.likes.map((item) => {
                                                    return (
                                                        <div className='pb-5 flex mt-3'>
                                                            <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                                                                <span className='flex flex-col justify-center items-center text-2xl pt-1'>{item.email[0].toUpperCase()}</span>
                                                            </div>
                                                            <span className='pl-5 text-xl font-semibold '>{getusername(item)}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                                <div>
                                    <div className=' relative m-5 p-5 card rounded-sm '>
                                        <div className='pb-5 flex'>
                                            <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                                                <span onClick={navprofile} className='flex flex-col justify-center items-center text-2xl'>{postdetail.user.email[0].toUpperCase()}</span>
                                            </div>
                                            <div className='flex'>
                                                <span className='pl-5 text-2xl'>{getusername(postdetail.user)}</span>
                                            </div>
                                            {postdetail.user.id == curruser.id ? (<div className=' '>
                                                <div className='absolute top-5 right-5'>
                                                    <div className='flex space-x-4'>
                                                        <MdModeEdit onClick={handleedit} size={25} />
                                                        <MdDelete onClick={postdel} size={25} />
                                                    </div>
                                                </div>
                                            </div>) : ''}
                                        </div>
                                        <img src={postdetail.imageurl} className='h-[200px] w-[500px]' />
                                        <div className='flex text-center justify-start pt-2'>{postdetail.description}</div>
                                        <div className='flex space-x-8 pt-2'>
                                            <div className='flex flex-col'>
                                                <SlLike size={25} onClick={likeorunlike} color={already ? 'red' : 'grey'} />
                                                <h1 onClick={handleshowlikes}>{postdetail.likes.length}</h1>
                                            </div>
                                            <div className='flex flex-col'>
                                                <FaComment onClick={hanldepostcoment} size={25} />
                                                <h1 onClick={handleshowcommnt}>{postdetail.comments.length}</h1>
                                            </div>
                                        </div>
                                        {
                                            editdesp && (
                                                <div className='relative w-100'>
                                                    <div className='mb-5 font-semibold text-2xl flex justify-between'>
                                                        <h1>Change your Post Description</h1>
                                                        <IoIosCloseCircleOutline className='absolute right-8' onClick={() => seteditdesp(false)} />
                                                    </div>
                                                    <hr />
                                                    <div className='flex space-x-5'>
                                                        <input type='text' placeholder='Change your description' value={changedesp} onChange={(e) => setchangedesp(e.target.value)}
                                                            className='border border-grey-300 h-10 w-[50vh] mt-5 rounded-3xl focus:border-grey-500 pl-5' />
                                                        <BsFillSendFill onClick={submitchangedesp} color='white' size={25} className='mt-6' />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            comment && (
                                                <div className='w-100'>
                                                    <div className='mb-5 font-semibold text-2xl flex justify-between'>
                                                        <label htmlFor='comment'>Comment</label>
                                                        <IoIosCloseCircleOutline onClick={() => setcomment(false)} />
                                                    </div>
                                                    <hr />
                                                    <div className='flex space-x-5'>
                                                        <input type='text' id='comment' placeholder='Enter your Comment' value={postcomment} onChange={(e) => setpostcomment(e.target.value)}
                                                            className='border border-grey-300 h-10 w-[50vh] mt-5 rounded-3xl focus:border-grey-500 pl-5' />
                                                        <BsFillSendFill onClick={handlecomment} color='white' size={25} className='mt-6' />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    showcomment && (
                                        <div className='w-100 -ml-[50px]'>
                                            <div className='mb-5 font-semibold text-2xl flex space-x-5 justify-between'>
                                                <h1>{postdetail.comments.length == 0 ? 'No ' : 'People who '}Comment on the post</h1>
                                                <IoIosCloseCircleOutline onClick={() => setshowcomment(false)} />
                                            </div>
                                            <hr />
                                            {
                                                postdetail.comments.map((item) => {
                                                    return (
                                                        <div key={postdetail.comments.indexOf(item)}>
                                                            <div className='pb-5 flex mt-3'>
                                                                <div className='h-15 w-[50px] rounded-full bg-blue-700 text-white'>
                                                                    <span className='flex flex-col justify-center items-center text-3xl pt-1.5'>{item.email[0].toUpperCase()}</span>
                                                                </div>
                                                                <div className='flex flex-col space-y-1'>
                                                                    <span className='pl-5 text-10 font-semibold '>{getusername(item)}</span>
                                                                    <div className='pl-5 '>{item.usercomment}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </Default>
        </div>
    )
}

export default PostDescp