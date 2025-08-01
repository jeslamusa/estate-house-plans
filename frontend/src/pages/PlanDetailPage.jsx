import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Download, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Layers, 
  ArrowLeft,
  Calendar,
  Eye,
  Building2
} from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import PurchaseModal from '../components/PurchaseModal'

const PlanDetailPage = () => {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  useEffect(() => {
    fetchPlan()
  }, [id])

  const fetchPlan = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/plans/${id}`)
      setPlan(response.data)
    } catch (error) {
      toast.error('Failed to load plan details')
      console.error('Error fetching plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (plan.is_free) {
      // Free plan - download directly
      try {
        const response = await fetch(`/api/plans/${id}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Create a temporary link to download the file
          const link = document.createElement('a')
          link.href = data.fileUrl
          link.download = `${plan.name}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          toast.success('Download started!')
        }
      } catch (error) {
        toast.error('Download failed')
        console.error('Download error:', error)
      }
    } else {
      // Paid plan - show purchase modal
      setShowPurchaseModal(true)
    }
  }

  const handlePaymentSuccess = async () => {
    // After successful payment, download the file
    try {
      const response = await fetch(`/api/plans/${id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Create a temporary link to download the file
        const link = document.createElement('a')
        link.href = data.fileUrl
        link.download = `${plan.name}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('Payment successful! Download started.')
      }
    } catch (error) {
      toast.error('Download failed after payment')
      console.error('Download error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan not found</h2>
          <p className="text-gray-600 mb-4">The house plan you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Plans</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div>
            {plan.image_url ? (
              <img
                src={plan.image_url}
                alt={plan.name}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src)
                  // Try direct backend URL as fallback
                  const fallbackUrl = `http://localhost:5000${plan.image_url}`
                  if (e.target.src !== fallbackUrl) {
                    e.target.src = fallbackUrl
                  } else {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', plan.image_url)
                }}
              />
            ) : null}
            <div className={`w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center ${plan.image_url ? 'hidden' : ''}`}>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h1>
              <p className="text-gray-600 text-lg">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              {plan.is_free ? (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  FREE DOWNLOAD
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  ${plan.price}
                </span>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Square className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="font-medium">{plan.area} sq ft</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bed className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-medium">{plan.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bath className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium">{plan.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Layers className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Floors</p>
                    <p className="font-medium">{plan.floors}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Length</p>
                  <p className="font-medium">{plan.length} ft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Width</p>
                  <p className="font-medium">{plan.width} ft</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="font-medium">{plan.download_count || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Added</p>
                    <p className="font-medium">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3"
            >
              <Download className="h-6 w-6" />
              <span>
                {plan.is_free ? 'Download Now' : 'Buy & Download'}
              </span>
            </button>

            {/* Payment Information for Paid Plans */}
            {!plan.is_free && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-900 mb-2">Payment Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Plan Price:</span>
                    <span className="font-semibold">${plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.5%):</span>
                    <span>${(plan.price * 0.085).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${(plan.price * 1.085).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  <p>• Secure payment processing</p>
                  <p>• Instant download after payment</p>
                  <p>• 30-day money-back guarantee</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {plan && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          plan={plan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default PlanDetailPage 