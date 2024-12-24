import React from 'react'
import AdminProjectList from './AdminProjectList' 
import JoinedProjects from '../JoinedProjects/JoinedaProjects'

const AssociatedProjects = () => {
  return (
    <div className='bg-gray-50'>
      <JoinedProjects/>
      <div className='w-[100%] mt-[20px] mb-[15px] h-[3px] bg-gray-200'></div>
      <AdminProjectList/>
    </div>
  )
}

export default AssociatedProjects
