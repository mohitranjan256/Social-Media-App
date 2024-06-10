import React from 'react'
import { Link } from 'react-router-dom'

function Error() {
  return (
<div className='h-[100vh] bg-blue-400 w-full'>
      <div className='absolute top-1/3 left-1/3 text-black text-2xl font-bold'>
          <span>
             There is no such page.
          </span>
          <Link to='/'>Click here to return on Home Page</Link>
      </div>
    </div>
  )
}

export default Error