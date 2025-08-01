import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'
import HomePage from './pages/HomePage'
import PlanDetailPage from './pages/PlanDetailPage'
import AdminLoginPage from './pages/admin/LoginPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminPlansPage from './pages/admin/PlansPage'
import AdminAddPlanPage from './pages/admin/AddPlanPage'
import AdminEditPlanPage from './pages/admin/EditPlanPage'
import AdminProfilePage from './pages/admin/ProfilePage'
import AdminSettingsPage from './pages/admin/SettingsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="plan/:id" element={<PlanDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="plans" element={
            <ProtectedRoute>
              <AdminPlansPage />
            </ProtectedRoute>
          } />
          <Route path="plans/add" element={
            <ProtectedRoute>
              <AdminAddPlanPage />
            </ProtectedRoute>
          } />
          <Route path="plans/edit/:id" element={
            <ProtectedRoute>
              <AdminEditPlanPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <AdminProfilePage />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <AdminSettingsPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App 