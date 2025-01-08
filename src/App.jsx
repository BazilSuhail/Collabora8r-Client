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
import AssignTasks from "./Components/Tasks/AssignTasks"; 
import Dashboard from "./Components/Dashboard";
import Overview from "./Components/Overview";
import Workflow from "./Components/Workflow/Workflow";
import TaskDetails from "./Components/Tasks/TaskDetails";
import TasksTimeline from "./Components/TasksTimeline";
import Notifications from "./Components/Profile/Notifications";

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/get-notifications" element={<Notifications />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/workflow" element={<Workflow />} />

        <Route path="/projects/tasks-timeline/:projectId" element={<TasksTimeline />} />

        <Route path="/associated-projects" element={<AdminProjectList />} />

        <Route path="/createproject" element={<CreateProject />} />


        <Route path="/task/:creatorId/:taskId" element={<TaskDetails />} />

        <Route path="/projects" element={<AdminProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/tasks/:projectId" element={<AssignTasks />} />

        <Route path="/joinedprojects" element={<JoinedProjects />} />
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
