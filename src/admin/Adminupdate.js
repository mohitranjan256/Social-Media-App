import React, { useEffect, useState } from 'react'
import Default from '../components/Default'
import { useParams } from 'react-router-dom'
import { firedb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Adminupdate() {
    const params = useParams();
    const [postdetail, setpostdetail] = useState();
    const [image, setimg] = useState('');
    const [desp, setdesp] = useState('');
    const curruser = JSON.parse(localStorage.getItem('User'));
    const getpostdetail = async () => {
        getDoc(doc(firedb, 'Posts', params.id)).then((resp) => {
            setpostdetail({ ...resp.data(), id: resp.id });
            setdesp(postdetail.description);
            setimg(postdetail.imageurl)
        }).catch(() => {
        })
    }
    useEffect(() => {
        getpostdetail();
    }, [])
    return (
        <div>
            <Default>
                <div>
                    <h1 className='text-3xl text-blue-700'>Edit the Post</h1>
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
            </Default>
        </div>
    )
}

export default Adminupdate