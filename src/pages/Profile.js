import React, { useEffect, useState } from 'react'
import Default from '../components/Default'
import { Outlet, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { firedb } from '../firebase';
import { FaUserEdit } from "react-icons/fa";
import ProfilePosts from '../components/ProfilePosts';
import { IoIosCloseCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { RiUserFollowFill, RiUserUnfollowFill } from 'react-icons/ri';

function Profile() {
    const params = useParams();
    const [userdata, setuserdata] = useState();
    const [userpost, setuserpost] = useState([]);
    const [edit, setedit] = useState(false);
    const [pbio, setbio] = useState('');
    const [image, setimg] = useState('');
    // console.log(params.id)
    const [follow, setfollow] = useState(false);
    const [shfollow, setshfollow] = useState(false);
    const localuser = JSON.parse(localStorage.getItem('User'))
    const getdetail = async () => {
        await getDoc(doc(firedb, 'Users', params.id)).then((resp) => {
            setuserdata(resp.data());
            if (resp.data().followers.find((user) => user.id === localuser.id)) {
                setfollow(true);
            }
            else {
                setfollow(false)
            }
        })
            .catch((err) => {
                console.log(err)
            })
    }
    const handlefollwers = async () => {

        let updatedfollowers = userdata.followers;
        if (follow) {
            updatedfollowers = userdata.followers.filter((user) => user.id !== localuser.id)
        }
        else {
            updatedfollowers.push({
                id: localuser.id,
                email: localuser.email
            })
        }
        setDoc(doc(firedb, 'Users', params.id), { ...userdata, followers: updatedfollowers }).then(() => {
            setfollow(!follow);
            getdetail();
        })

    }
    const getpostdetail = async () => {

        getDocs(collection(firedb, "Posts")).then((resp) => {
            const temp = []
            resp.forEach((item) => {
                temp.push({ ...item.data(), id: item.id })
            })
            const posts = temp.filter((item) => {
                if (item.user.id === params.id) {
                    return item;
                }
            })
            posts.sort(function(x, y){
                return x.time - y.time;
            })
            posts.reverse();
            setuserpost(posts);
        })
    }
    const getusername = (data) => {
        if (!data) {
            return;
        }
        const email = data.email;
        let i = 0;
        for (; i < email.length; i++) {
            if (email[i] === '@') {
                break;
            }
        }
        const username = email.substr(0, i);
        return username;
    }
    const getprofilepicurl = (data) => {
        if (!data) {
            return;
        }
        return data.profilePicurl;
    }
    const getbio = (data) => {
        if (!data) {
            return;
        }
        return data.bio;
    }
    const getfirestletter = (data) => {
        if (!data) {
            return;
        }
        return data.email[0].toUpperCase();
    }
    const getemail = (data) => {
        if (!data) return
        return data.email;
    }
    const editing = () => {
        setedit(true);
    }
    const change = async () => {
        if (!userdata) {
            return;
        }
        try {
            if (image && pbio) {
                const storage = getStorage();
                const storageRef = ref(storage, `/Profile/${image.name}`);
                const snapshot = await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                setDoc(doc(firedb, 'Users', params.id), { ...userdata, profilePicurl: url, bio: pbio }).then(() => {
                    getdetail();
                    alert('Profile Details Updated')
                    setedit(false);
                })
            }
            else if (image && !pbio) {
                const storage = getStorage();
                const storageRef = ref(storage, `/Profile/${image.name}`);
                const snapshot = await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                setDoc(doc(firedb, 'Users', params.id), { ...userdata, profilePicurl: url }).then(() => {
                    getdetail();
                    alert('Profile Details Updated')
                    setedit(false);
                })
            }
            else {

                const storage = getStorage();
                const storageRef = ref(storage, `/Profile/${image.name}`);
                const snapshot = await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                setDoc(doc(firedb, 'Users', params.id), { ...userdata, bio: pbio }).then(() => {
                    getdetail();
                    alert('Profile Details Updated')
                    setedit(false);
                })
            }
            setbio('');
        }
        catch (e) {

        }
    }
    const getfollwers = (data) => {
        if (!data) return;
        return data.followers.length;
    }
    const showfollowers = () => {
        setshfollow(true);
    }
    const checkfollowe = () => {
        if (!userdata) return;
        userdata.followers.map((user) => {
            
        })

    }
    useEffect(() => {
        getdetail();
        getpostdetail();
        checkfollowe();
    }, [])
    // console.log(userdata)
    return (
        <div>
            <Default>
                <div className='flex space-x-5 h-[75vh]' key={params.id}>
                    <div className='flex flex-col card p-5'>
                        <div className='pb-5 flex'>
                            <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                                <span className='flex flex-col justify-center items-center text-2xl pt-1'>{getfirestletter(userdata)}</span>
                            </div>
                            <span className='pl-5 pr-5 text-2xl'>{getusername(userdata)}</span>
                            <div className='flex flex-col'>
                                {
                                    params.id === localuser.id ? <FaUserEdit onClick={editing} style={{ paddingTop: '7px' }} size={25} />
                                        : follow ? <> <RiUserUnfollowFill onClick={handlefollwers} /> <div className='text-xl pl-1' onClick={showfollowers}>{getfollwers(userdata)}</div> </>
                                            : <> <RiUserFollowFill onClick={handlefollwers} /> <div className='text-xl pl-1' onClick={showfollowers}>{getfollwers(userdata)}</div> </>
                                }
                            </div>
                        </div>
                        <hr />
                        <div>
                            {
                                getprofilepicurl(userdata) && (

                                    <div className='flex justify-center items-center pt-5'>
                                        <img className=' h-[150px] w-[150px] rounded-full' src={getprofilepicurl(userdata)} alt='Profile Pic' />
                                    </div>
                                )
                            }
                            {
                                !getprofilepicurl(userdata) && (

                                    <div className='text-black font-semibold text-1xl pt-3 pl-8'>
                                        No Profile Pic
                                    </div>
                                )
                            }
                            <div className='text-black font-semibold text-1xl pt-3 pl-8'>
                                Email ID : {getemail(userdata)}
                            </div>
                            {
                                getbio(userdata) && (
                                    <div className='text-black font-semibold text-1xl pt-3 pl-8'>
                                        Bio : {getbio(userdata)}
                                    </div>
                                )
                            }
                            {
                                !getbio(userdata) && (
                                    <div className='text-black font-semibold text-1xl pt-3 pl-8'>
                                        No Bio
                                    </div>
                                )
                            }
                            {
                                params.id === localuser.id ? <div onClick={showfollowers} className='text-black font-semibold text-1xl pt-3 pl-8'>No of Followers : {getfollwers(userdata)}</div> : ""
                            }
                            {
                                shfollow && (
                                    <div className='w-[40vh] ml-[10px] pt-2'>
                                        <div className='mb-5 font-semibold text-xl flex justify-between'>
                                            <h1>People who follow you</h1>
                                            <IoIosCloseCircleOutline color='red' onClick={() => setshfollow(false)} />
                                        </div>
                                        <hr />
                                        <div className='overflow-y-auto overflow-x-hidden'>
                                            {
                                                userdata.followers.map((item) => {
                                                    return (
                                                        <div>
                                                            <div className='pb-5 flex mt-3'>
                                                                <div className='h-10 w-10 rounded-full bg-blue-700 text-white'>
                                                                    <span className='flex flex-col justify-center items-center text-2xl pt-1'>{getusername(item)[0].toUpperCase()}</span>
                                                                </div>
                                                                <span className='pl-5 text-xl font-semibold '>{getusername(item)}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {
                        !edit && (
                            <div className='overflow-y-auto card'>
                                {
                                    <div className='grid grid-cols-2'>
                                        {
                                            userpost && (
                                                userpost.map((item) => {
                                                    return <ProfilePosts className='h-[50px] w-[50px]' post={item} />
                                                })
                                            )
                                        }
                                    </div>
                                }
                            </div>
                        )
                    }
                    {
                        edit && (
                            <div className='w-[150vh] flex justify-center items-center card'>
                                <div>
                                    <div className='w-[420px] flex flex-col space-y-5 card p-10 rounded-sm'>
                                        <div className='flex space-x-[200px]'>
                                            <h1 className='text-4xl text-primary font-semibold '>Editing</h1>
                                            <IoMdCloseCircleOutline className='-mt-5' onClick={() => setedit(false)} size={30} color='red' />
                                        </div>
                                        <hr />
                                        <label htmlFor='bio' className='text-2xl font-semibold'>Edit or Change your Bio</label>
                                        <input type='text' id='bio' placeholder='Edit or Change your Bio' value={pbio} onChange={(e) => setbio(e.target.value)}
                                            className='border border-grey-300 h-10  rounded-sm focus:border-grey-500 pl-5' />
                                        <label htmlFor='files' className='text-2xl font-semibold'>Change your Profile Pic</label>
                                        <input id='files' type='file' onChange={(e) => setimg(e.target.files[0])} />
                                        <div className='flex justify-end'>
                                            <button className='bg-primary h-10 rounded-sm text-white px-10' onClick={change}>Change</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <Outlet />
                </div>
            </Default>
        </div>
    )
}

export default Profile