import React from 'react'
import Header from './Header'

function Default(props) {
  return (
    <div className='px-20 pt-5 h-[100vh] pb-0 md:mx-5 bg-blue-300'>
        <Header/>
        <div className='content mt-5 border-2 h-[81vh] rounded-md p-5 border-black overflow-x-hidden overflow-y-auto'>{props.children}</div>
    </div>
  )
}

export default Default