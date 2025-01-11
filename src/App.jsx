import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import LoginUser from "./Components/authentication/LoginUser";
import Register from "./Components/authentication/RegisterUser";
import Profile from "./Components/authentication/Profile";


import CreateProject from "./Components/Projects/CreateProject";
import AdminProjectList from "./Components/Projects/AdminProjectList";
import ProjectDetail from "./Components/Projects/ProjectDetails";
import JoinedProjectDetails from "./Components/JoinedProjects/JoinedProjectDetails";
import JoinedProjects from "./Components/JoinedProjects/JoinedProjects";
import ManageTasks from "./Components/Tasks/ManageTasks"; 
import Dashboard from "./Components/Dashboard";
import Overview from "./Components/Overview";
import Workflow from "./Components/Workflow/Workflow";
import TaskDetails from "./Components/Tasks/TaskDetails";
import TasksTimeline from "./Components/TasksTimeline"; 
import ProjectInvitationDetails from "./Components/Profile/MemberAccept";
import ProjectManagerInvitation from "./Components/Profile/ManagerAccept"
;
import ManagerProjects from "./Components/JoinedProjects/ManagerProjects";
const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/overview" element={<Overview />} />
        <Route path="/workflow" element={<Workflow />} />

        <Route path="/project-details/:projectId/:senderId" element={<ProjectInvitationDetails />} />
        <Route path="/manager-invitation/:projectId" element={<ProjectManagerInvitation />} />


        
        <Route path="/projects/tasks-timeline/:projectId" element={<TasksTimeline />} />

        <Route path="/associated-projects" element={<AdminProjectList />} />

        <Route path="/createproject" element={<CreateProject />} />


        <Route path="/task/:creatorId/:taskId" element={<TaskDetails />} />

        <Route path="/projects" element={<AdminProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/tasks/:projectId" element={<ManageTasks />} />

        <Route path="/joined-projects" element={<JoinedProjects />} />
        <Route path="/manager-projects" element={<ManagerProjects />} />
        <Route path="/joinedprojects/:projectId" element={<JoinedProjectDetails />} />

        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* <Footer/> */}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
