import React from 'react'
import Dashboard from './dashboard'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='mx-auto max-w-7xl'>
        Admin Dashboard
        {children}
    </div>
  )
}
