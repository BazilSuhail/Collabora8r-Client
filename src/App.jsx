import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SidebarLayout from './components/layout/SidebarLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Overview from './pages/Overview'
import Workflow from './pages/Workflow'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminProjectList from './pages/projects/AdminProjectList'
import JoinedProjectList from './pages/projects/JoinedProjectList'
import ManagerProjectList from './pages/projects/ManagerProjectList'
import CreateProject from './pages/projects/CreateProject'
import AdminProjectDetail from './pages/projects/AdminProjectDetail'
import JoinedProjectDetail from './pages/projects/JoinedProjectDetail'
import ManageProjectTasks from './pages/projects/ManageProjectTasks'
import KanbanBoard from './pages/projects/board/KanbanBoard'
import SprintPlanning from './pages/projects/backlog/SprintPlanning'
import SprintDetail from './pages/projects/sprints/SprintDetail'
import TeamManagement from './pages/projects/team/TeamManagement'
import ProjectSettings from './pages/projects/settings/ProjectSettings'
import ActivityLog from './pages/projects/activity/ActivityLog'
import TimeTracking from './pages/projects/time/TimeTracking'
import Labels from './pages/projects/labels/Labels'
import Webhooks from './pages/projects/webhooks/Webhooks'
import SavedFilters from './pages/projects/filters/SavedFilters'
import TaskDetail from './pages/tasks/TaskDetail'
import Profile from './pages/profile/Profile'
import Notifications from './pages/notifications/Notifications'
import OrganizationList from './pages/organizations/OrganizationList'
import OrganizationDetail from './pages/organizations/OrganizationDetail'
import Invitations from './pages/invitations/Invitations'
import useAuthStore from './stores/authStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/projects" element={<AdminProjectList />} />
          <Route path="/projects/joined" element={<JoinedProjectList />} />
          <Route path="/projects/managing" element={<ManagerProjectList />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<AdminProjectDetail />} />
          <Route path="/projects/:projectId/joined" element={<JoinedProjectDetail />} />
          <Route path="/projects/:projectId/manage" element={<ManageProjectTasks />} />
          <Route path="/projects/:projectId/board" element={<KanbanBoard />} />
          <Route path="/projects/:projectId/backlog" element={<SprintPlanning />} />
          <Route path="/projects/:projectId/sprints" element={<SprintDetail />} />
          <Route path="/projects/:projectId/team" element={<TeamManagement />} />
          <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
          <Route path="/projects/:projectId/activity" element={<ActivityLog />} />
          <Route path="/projects/:projectId/time" element={<TimeTracking />} />
          <Route path="/projects/:projectId/labels" element={<Labels />} />
          <Route path="/projects/:projectId/webhooks" element={<Webhooks />} />
          <Route path="/projects/:projectId/filters" element={<SavedFilters />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/organizations" element={<OrganizationList />} />
          <Route path="/organizations/:orgId" element={<OrganizationDetail />} />
          <Route path="/invitations" element={<Invitations />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
