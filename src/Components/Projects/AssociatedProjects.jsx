import React from 'react'
import ProjectList from './AdminProjectList' 
import JoinedProjects from './JoinedaProjects'
const AssociatedProjects = () => {
  return (
    <div className='bg-gray-50'>
      <JoinedProjects/>
      <div className='w-[100%] mt-[20px] mb-[15px] h-[3px] bg-gray-200'></div>
      <ProjectList/>
    </div>
  )
}

export default AssociatedProjects
