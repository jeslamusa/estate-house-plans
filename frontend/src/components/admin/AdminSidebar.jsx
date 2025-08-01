import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Download,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  Bell,
  PieChart,
  Activity,
  Plus,
  Home,
  Search,
  Filter,
  LogOut
} from 'lucide-react'

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      title: 'House Plans',
      path: '/admin/plans',
      icon: Building2,
      description: 'Manage house plans'
    },
    {
      title: 'Add Plan',
      path: '/admin/plans/add',
      icon: Plus,
      description: 'Create new plan'
    },
    {
      title: 'Downloads',
      path: '/admin/downloads',
      icon: Download,
      description: 'Track downloads'
    },
    {
      title: 'Revenue',
      path: '/admin/revenue',
      icon: DollarSign,
      description: 'Financial reports'
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: Users,
      description: 'User management'
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      description: 'Detailed analytics'
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      icon: FileText,
      description: 'Generate reports'
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      description: 'System settings'
    },
    {
      title: 'Profile',
      path: '/admin/profile',
      icon: Users,
      description: 'Manage profile'
    }
  ]

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Estate Plan</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${
                  isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.title}</span>
                  <p className={`text-xs ${
                    isActive(item.path) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@estateplans.com</p>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar 