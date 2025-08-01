import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Building2, Download, Menu, X } from 'lucide-react'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">Estate Plans</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Admin Link */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/admin/login" 
              className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 p-2 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-primary-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 inline mr-2" />
                Home
              </Link>
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-primary-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="h-5 w-5 inline mr-2" />
                House Plans
              </Link>
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-primary-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Download className="h-5 w-5 inline mr-2" />
                Free Plans
              </Link>
              <Link 
                to="/admin/login" 
                className="block text-gray-600 hover:text-primary-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 