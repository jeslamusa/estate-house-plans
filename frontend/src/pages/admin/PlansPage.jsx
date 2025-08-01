import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Building2,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

const PlansPage = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedPlans, setSelectedPlans] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    fetchPlans()
  }, [searchTerm, filter, sortBy, sortOrder, pagination.current])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 12,
        search: searchTerm,
        filter,
        sortBy,
        sortOrder
      })

      const response = await api.get(`/plans?${params}`)
      setPlans(response.data.plans || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      await api.delete(`/plans/${planId}`)
      toast.success('Plan deleted successfully')
      fetchPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Failed to delete plan')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPlans.length === 0) {
      toast.error('Please select plans to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedPlans.length} plans?`)) return

    try {
      await Promise.all(selectedPlans.map(id => api.delete(`/plans/${id}`)))
      toast.success(`${selectedPlans.length} plans deleted successfully`)
      setSelectedPlans([])
      fetchPlans()
    } catch (error) {
      console.error('Error bulk deleting plans:', error)
      toast.error('Failed to delete plans')
    }
  }

  const togglePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    )
  }

  const toggleAllPlans = () => {
    if (selectedPlans.length === plans.length) {
      setSelectedPlans([])
    } else {
      setSelectedPlans(plans.map(plan => plan.id))
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  )

  const PlanCard = ({ plan }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        {plan.image_url ? (
          <img
            src={plan.image_url}
            alt={plan.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${plan.image_url ? 'hidden' : ''}`}>
          <div className="text-center">
            <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No image</p>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          {plan.is_free ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              FREE
            </span>
          ) : (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {plan.price}
            </span>
          )}
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={selectedPlans.includes(plan.id)}
            onChange={() => togglePlanSelection(plan.id)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{plan.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.description}</p>
        
        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Building2 className="h-3 w-3 mr-1" />
            <span>{plan.area} sq ft</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{plan.bedrooms} beds</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{plan.download_count || 0} downloads</span>
          <span>{new Date(plan.created_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link
              to={`/admin/plans/edit/${plan.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <Link
              to={`/plan/${plan.id}`}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(plan.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">House Plans Management</h1>
            <p className="text-gray-600">Manage and organize your house plan collection</p>
          </div>
          <Link
            to="/admin/plans/add"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Plan</span>
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Plans"
            value={plans.length}
            icon={Building2}
            color="bg-blue-500"
          />
          <StatCard
            title="Free Plans"
            value={plans.filter(p => p.is_free).length}
            icon={Download}
            color="bg-green-500"
          />
          <StatCard
            title="Paid Plans"
            value={plans.filter(p => !p.is_free).length}
            icon={DollarSign}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Downloads"
            value={plans.reduce((sum, p) => sum + (p.download_count || 0), 0)}
            icon={BarChart3}
            color="bg-orange-500"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Plans</option>
                <option value="paid">Paid Plans</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="download_count">Downloads</option>
                <option value="price">Price</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPlans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedPlans.length} plan(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleAllPlans}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {selectedPlans.length === plans.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPlans.length === plans.length && plans.length > 0}
                      onChange={toggleAllPlans}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan.id)}
                        onChange={() => togglePlanSelection(plan.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
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
                        {plan.is_free ? 'Free' : `$${plan.price}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.download_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/plans/edit/${plan.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/plan/${plan.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.current} of {pagination.total}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlansPage 