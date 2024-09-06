import React from 'react'
import ProjectList from './AdminProjectList' 
import JoinedProjects from './JoinedaProjects'
const AssociatedProjects = () => {
  return (
    <>
      <JoinedProjects/>
      <div className='w-[100%] mt-[20px] mb-[15px] h-[3px] bg-gray-200'></div>
      <ProjectList/>
    </>
  )
}

export default AssociatedProjects
