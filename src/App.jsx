import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Assets/Navbar";
import { useAuthContext } from "./AuthProvider";
import SignInLoader from "./Assets/Loaders/SignInLoader";
import Loader from "./Assets/Loaders/Loader";

// Lazy load components
const Home = React.lazy(() => import("./components/Home"))
const SignIn = React.lazy(() => import("./components/authentication/SignIn"))
const SignUp = React.lazy(() => import("./components/authentication/SignUp"))
const Profile = React.lazy(() => import("./components/profile/Profile"))
const CreateProject = React.lazy(() => import("./Assets/ProjectModals/CreateProject"))
const AdminProjectList = React.lazy(() => import("./components/adminProjects/AdminProjectList"))
const AdminProjectDetails = React.lazy(() => import("./components/adminProjects/AdminProjectDetails"))
const JoinedProjectDetails = React.lazy(() => import("./components/JoinedProjects/JoinedProjectDetails"))
const JoinedProjectList = React.lazy(() => import("./components/JoinedProjects/JoinedProjectList"))
const ManageProjectTasks = React.lazy(() => import("./components/adminProjects/ManageProjectTasks"))
const Dashboard = React.lazy(() => import("./components/Dashboard"))
const Overview = React.lazy(() => import("./components/Overview"))
const Workflow = React.lazy(() => import("./components/Workflow"))
const JoinedTaskDetails = React.lazy(() => import("./components/JoinedProjects/JoinedTaskDetails"))
const TasksTimeline = React.lazy(() => import("./components/JoinedProjects/TasksTimeline"))
const ProjectInvitationDetails = React.lazy(() => import("./Assets/ProfileModals/MemberAccept"))
const ProjectManagerInvitation = React.lazy(() => import("./Assets/ProfileModals/ManagerAccept"))
const ManagerProjectList = React.lazy(() => import("./components/ManagerProject/ManagerProjectList"))
const SearchProject = React.lazy(() => import("./Assets/ProfileModals/SearchProject"))

import Layout from "./components/Layout";

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
          <Route path="/associated-projects" element={<AdminProjectList />} />
          <Route path="/createproject" element={<CreateProject />} />
          <Route path="/search-project" element={<SearchProject />} />
          <Route path="/task/:creatorId/:taskId" element={<JoinedTaskDetails />} />
          <Route path="/projects" element={<AdminProjectList />} />
          <Route path="/projects/:projectId" element={<AdminProjectDetails />} />
          <Route path="/tasks/:projectId" element={<ManageProjectTasks />} />
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