import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Loader from "./components/loaders/Loader";

// Lazy load components
const Home = React.lazy(() => import("./pages/Home"))
const SignIn = React.lazy(() => import("./pages/authentication/SignIn"))
const SignUp = React.lazy(() => import("./pages/authentication/SignUp"))
const Profile = React.lazy(() => import("./pages/profile/Profile"))
const CreateProject = React.lazy(() => import("./components/project-modals/CreateProject"))
const AdminProjectList = React.lazy(() => import("./pages/admin/AdminProjectList"))
const AdminProjectDetails = React.lazy(() => import("./pages/admin/AdminProjectDetails"))
const JoinedProjectDetails = React.lazy(() => import("./pages/joined/JoinedProjectDetails"))
const JoinedProjectList = React.lazy(() => import("./pages/joined/JoinedProjectList"))
const ManageProjectTasks = React.lazy(() => import("./pages/manager/ManageProjectTasks"))
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Overview = React.lazy(() => import("./pages/Overview"))
const Workflow = React.lazy(() => import("./pages/Workflow"))
const JoinedTaskDetails = React.lazy(() => import("./pages/joined/JoinedTaskDetails"))
const TasksTimeline = React.lazy(() => import("./pages/TasksTimeline"))
const ProjectInvitationDetails = React.lazy(() => import("./components/profile-modals/MemberAccept"))
const ProjectManagerInvitation = React.lazy(() => import("./components/profile-modals/ManagerAccept"))
const ManagerProjectList = React.lazy(() => import("./pages/manager/ManagerProjectList"))
const SearchProject = React.lazy(() => import("./components/profile-modals/SearchProject"))

import Layout from "./components/layout/Layout";

const AppContent = () => {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/project-details/:projectId/:senderId" element={<ProjectInvitationDetails />} />
          <Route path="/manager-invitation/:projectId" element={<ProjectManagerInvitation />} />
          <Route path="/projects/tasks-timeline/:projectId" element={<TasksTimeline />} />
          <Route path="/admin-projects" element={<AdminProjectList />} />
         
        
          <Route path="/search-project" element={<SearchProject />} />
          <Route path="/task/:creatorId/:taskId" element={<JoinedTaskDetails />} />
          <Route path="/projects" element={<AdminProjectList />} />
          <Route path="/projects/:projectId" element={<AdminProjectDetails />} />
          <Route path="/manager-tasks/:projectId" element={<ManageProjectTasks />} />
          <Route path="/joined-projects" element={<JoinedProjectList />} />
          <Route path="/manager-projects" element={<ManagerProjectList />} />
          <Route path="/joinedprojects/:projectId" element={<JoinedProjectDetails />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Layout>
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