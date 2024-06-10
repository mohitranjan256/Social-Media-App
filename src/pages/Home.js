import React, { useEffect, useState } from 'react'
import Default from '../components/Default'
import { collection, getDocs } from 'firebase/firestore';
import { firedb } from '../firebase';
import Post from '../components/Post';

function Home() {
    const [posts, setposts] = useState([]);

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
        // console.log(posts)
    }
    useEffect(() => {
        getposts();
    }, [])
    return (
        <div>
            <Default>
                <div className='grid grid-cols-3 md:grid-cols-1'>
                    {posts.map((item) => {
                        return <Post key={item.id} post={item}/>
                    })}
                </div>
            </Default>
        </div>
    )
}

export default Home