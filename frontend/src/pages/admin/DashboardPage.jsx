import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home, 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download,
  Calendar,
  MapPin,
  Search,
  Bell,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Filter,
  Menu,
  User
} from 'lucide-react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import NotificationsModal from '../../components/NotificationsModal'
import MessagesModal from '../../components/MessagesModal'

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [recentPlans, setRecentPlans] = useState([])
  const [recentDownloads, setRecentDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@estateplans.com',
    avatar: null
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, plansRes, downloadsRes] = await Promise.all([
        api.get('/stats/overview'),
        api.get('/plans?limit=5'),
        api.get('/stats/recent-downloads')
      ])
      
      setStats(statsRes.data)
      setRecentPlans(plansRes.data.plans || [])
      setRecentDownloads(downloadsRes.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      {children}
    </div>
  )

  const ActivityItem = ({ plan, downloads, date }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
        <Download className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{plan}</p>
        <p className="text-xs text-gray-500">{downloads} downloads</p>
      </div>
      <div className="text-xs text-gray-400">{date}</div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600">      </div>

      {/* Modals */}
      <NotificationsModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <MessagesModal 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
      />
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your house plans and track performance</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans, users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Messages */}
            <button 
              onClick={() => setShowMessages(true)}
              className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Link to="/admin/profile" className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {adminProfile.avatar ? (
                    <img src={adminProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{adminProfile.name}</p>
                  <p className="text-xs text-gray-500">{adminProfile.email}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total House Plans"
            value={stats.totalPlans}
            icon={Building2}
            color="bg-blue-500"
            trend={12}
            subtitle="Available for download"
          />
          <StatCard
            title="Total Downloads"
            value={stats.totalDownloads}
            icon={Download}
            color="bg-green-500"
            trend={8}
            subtitle="This month"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-purple-500"
            trend={-3}
            subtitle="From paid plans"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Users}
            color="bg-orange-500"
            trend={15}
            subtitle="Last 30 days"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <ChartCard title="Revenue Analytics">
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Revenue chart will be displayed here</p>
                  <p className="text-sm text-gray-500">Integration with Chart.js or ApexCharts</p>
                </div>
              </div>
            </ChartCard>

            {/* Download Trends */}
            <ChartCard title="Download Trends">
              <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">Download trends chart will be displayed here</p>
                  <p className="text-sm text-gray-500">Line chart showing daily/weekly downloads</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <ChartCard title="Recent Downloads">
              <div className="space-y-2">
                {recentDownloads.length > 0 ? (
                  recentDownloads.map((item, index) => (
                    <ActivityItem
                      key={index}
                      plan={item.plan_name || 'House Plan'}
                      downloads={item.download_count || 0}
                      date={new Date(item.downloaded_at).toLocaleDateString()}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent downloads</p>
                  </div>
                )}
              </div>
            </ChartCard>

            <ChartCard title="Quick Actions">
              <div className="space-y-3">
                <Link
                  to="/admin/plans/add"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Plan</span>
                </Link>
                <Link
                  to="/admin/plans"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>View All Plans</span>
                </Link>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </button>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Recent Plans Table */}
        <ChartCard title="Recent House Plans" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                          <div className="text-sm text-gray-500">{plan.area} sq ft</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.is_free 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {plan.is_free ? 'Free' : 'Paid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.download_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.is_free ? 'Free' : `$${plan.price}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/admin/plans/edit/${plan.id}`} className="text-blue-600 hover:text-blue-900 mr-3">Edit</Link>
                      <Link to={`/plan/${plan.id}`} className="text-gray-600 hover:text-gray-900 mr-3">View</Link>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default DashboardPage 