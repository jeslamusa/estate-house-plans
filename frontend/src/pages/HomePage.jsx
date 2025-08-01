import { useState, useEffect } from 'react'
import { Search, Filter, Download, DollarSign, Building2 } from 'lucide-react'
import { api } from '../services/api'
import PlanCard from '../components/plans/PlanCard'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchPlans()
  }, [search, filter, currentPage])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      })
      
      if (search) params.append('search', search)
      if (filter) params.append('filter', filter)

      const response = await api.get(`/plans?${params}`)
      setPlans(response.data.plans)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error('Failed to load house plans')
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter === filter ? '' : newFilter)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Find Your Dream House Plan
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 px-4">
            Browse thousands of professional house plans. Free and premium designs for every budget.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search house plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 px-6 py-3 sm:py-4 rounded-lg font-medium transition-colors text-base"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-4 sm:py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            <span className="text-gray-600 font-medium text-sm sm:text-base">Filter by:</span>
            
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => handleFilterChange('free')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                  filter === 'free'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Free Plans</span>
              </button>
              
              <button
                onClick={() => handleFilterChange('paid')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                  filter === 'paid'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Paid Plans</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="responsive-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-200 h-40 sm:h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : plans.length > 0 ? (
            <>
              <div className="responsive-grid">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-gray-600">
                      Page {pagination.current} of {pagination.total}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No house plans found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage 