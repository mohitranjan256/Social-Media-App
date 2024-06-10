import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from 'react'
import Default from '../components/Default'
import { addDoc, collection } from "firebase/firestore";
import { firedb } from "../firebase";
import { useNavigate } from "react-router-dom";

function Addposts() {
    const [image, setimg] = useState('');
    const [desp, setdesp] = useState('');
    const nav=useNavigate();
    const addpost = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `/posts/${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            // console.log(snapshot.ref);

            const url = await getDownloadURL(storageRef);
            addDoc(collection(firedb, 'Posts'), {
                imageurl: url,
                description: desp,
                comments: [],
                likes: [],
                time : new Date(),
                user: JSON.parse(localStorage.getItem('User'))
            }).then(() => {
                alert('Post Uploaded Successfully...')
                nav('/');
            })
        }
        catch (err) {
            alert('Something went wrong...')
        }
    }
    return (
        <div>
            <Default>
                <div>
                    <h1 className='text-3xl text-blue-700'>Add new Post</h1>
                    <div className='w-screen pt-5 flex flex-col'>
                        <textarea placeholder='Write description of your post' value={desp} onChange={(e) => setdesp(e.target.value)} className='border-gray-500 border-2 w-1/2 p-5 ' rows='5'>
                        </textarea>
                        <input className='pt-5' type='file' onChange={(e) => setimg(e.target.files[0])} />
                        {
                            image && (
                                <img src={URL.createObjectURL(image)} alt='Uploaded posts' className='mt-5 h-52 w-52 pb-5 rounded-sm' />
                            )
                        }
                    </div>
                </div>
                {desp && image && (
                    <button className="bg-primary p-[10px] rounded-2xl text-white" onClick={addpost}>Add the Post</button>
                )}
            </Default>
        </div>
    )
}

export default Addposts