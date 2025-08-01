import { useAuth } from '../../contexts/AuthContext'
import { LogOut, User, Bell } from 'lucide-react'

const AdminHeader = ({ onNotificationsClick }) => {
  const { admin, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your house plans</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onNotificationsClick}
              className="relative flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="text-sm">Notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{admin?.email}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader 