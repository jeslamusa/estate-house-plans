import { Link } from 'react-router-dom'
import { Home, Building2, Download } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Estate Plans</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </Link>
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Building2 className="h-4 w-4 inline mr-1" />
              House Plans
            </Link>
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Free Plans
            </Link>
          </nav>

          {/* Admin Link */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/login" 
              className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 