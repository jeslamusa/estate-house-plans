import { Link } from 'react-router-dom'
import { Download, DollarSign, Bed, Bath, Square, Layers, Building2 } from 'lucide-react'

const PlanCard = ({ plan }) => {
  const handleDownload = (e) => {
    e.preventDefault()
    
    if (plan.is_free) {
      // For free plans, go to detail page where download is handled
      window.location.href = `/plan/${plan.id}`
    } else {
      // For paid plans, go to detail page where payment modal will be shown
      window.location.href = `/plan/${plan.id}`
    }
  }

  return (
    <div className="card-hover group">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        {plan.image_url ? (
          <img
            src={plan.image_url}
            alt={plan.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className={`w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ${plan.image_url ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        </div>
        
        {/* Price badge */}
        <div className="absolute top-2 right-2">
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
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          <Link to={`/plan/${plan.id}`}>
            {plan.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {plan.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Square className="h-4 w-4" />
            <span>{plan.area} sq ft</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span>{plan.bedrooms} beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span>{plan.bathrooms} baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Layers className="h-4 w-4" />
            <span>{plan.floors} floors</span>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>
            {plan.is_free ? 'Free Download' : 'Buy & Download'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default PlanCard 