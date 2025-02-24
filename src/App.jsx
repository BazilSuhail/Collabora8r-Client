import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Assets/Navbar";
import { useAuthContext } from "./AuthProvider";
import SignInLoader from "./Assets/Loaders/SignInLoader";
import Loader from "./Assets/Loaders/Loader";

// Lazy load components
const SignIn = React.lazy(() => import("./Components/Authentication/SignIn"))
const SignUp = React.lazy(() => import("./Components/Authentication/SignUp"))
const Profile = React.lazy(() => import("./Components/Profile/Profile"))
const CreateProject = React.lazy(() => import("./Assets/ProjectModals/CreateProject"))
const AdminProjectList = React.lazy(() => import("./Components/AdminProjects/AdminProjectList"))
const AdminProjectDetails = React.lazy(() => import("./Components/AdminProjects/AdminProjectDetails"))
const JoinedProjectDetails = React.lazy(() => import("./Components/JoinedProjects/JoinedProjectDetails"))
const JoinedProjectList = React.lazy(() => import("./Components/JoinedProjects/JoinedProjectList"))
const ManageProjectTasks = React.lazy(() => import("./Components/AdminProjects/ManageProjectTasks"))
const Dashboard = React.lazy(() => import("./Components/Dashboard"))
const Overview = React.lazy(() => import("./Components/Overview"))
const Workflow = React.lazy(() => import("./Components/Workflow"))
const JoinedTaskDetails = React.lazy(() => import("./Components/JoinedProjects/JoinedTaskDetails"))
const TasksTimeline = React.lazy(() => import("./Components/JoinedProjects/TasksTimeline"))
const ProjectInvitationDetails = React.lazy(() => import("./Assets/ProfileModals/MemberAccept"))
const ProjectManagerInvitation = React.lazy(() => import("./Assets/ProfileModals/ManagerAccept"))
const ManagerProjectList = React.lazy(() => import("./Components/ManagerProject/ManagerProjectList"))
const SearchProject = React.lazy(() => import("./Assets/ProfileModals/SearchProject"))

const AppContent = () => {
  const location = useLocation();
  const { userLoginStatus } = useAuthContext();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {(!hideNavbar && userLoginStatus) && <Navbar />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={userLoginStatus === false ? <SignIn /> : <Dashboard />} />
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
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
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