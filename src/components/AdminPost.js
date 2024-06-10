// import React from 'react'

// function AdminPost(props) {
//     return (
//         <div className='pb-4 pr-4'>
//             <div className='content border-2 rounded-xl border-black p-5 '>
//                 <img src={item.imageurl} alt='Posted' />
//                 <div>Description : {props.item.description}</div>
//                 <div>No of Likes : {props.item.likes.length}</div>
//                 <div>No of Comments : {props.item.comments.length}</div>
//                 <div>Posted by : {getusername(props.item.user)}</div>
//                 <div>Posted person email id : {props.item.user.email}</div>
//                 <div className='flex justify-end space-x-4'>
//                     <GrPowerReset onClick={() => {
//                         updateDoc(doc(firedb, 'Posts', props.item.id), {
//                             likes: [],
//                             comments: []
//                         })
//                         getposts();
//                     }} size={35} />
//                     <MdDelete onClick={() => {
//                         deleteDoc(doc(firedb, 'Posts', props.item.id))
//                         getposts();
//                     }} size={35} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AdminPost