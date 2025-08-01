import { Building2, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Estate Plans</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and download premium house plans. Browse our collection of free and paid architectural designs for your dream home.
            </p>
            
                         {/* Social Media Links */}
             <div className="flex space-x-4">
               <a 
                 href="https://facebook.com/jesla.mmassy" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-500 transition-colors"
               >
                 <Facebook className="h-5 w-5" />
               </a>
               <a 
                 href="https://twitter.com/_j.e.s.l.a" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors"
               >
                 <Twitter className="h-5 w-5" />
               </a>
               <a 
                 href="https://instagram.com/_j.e.s.l.a" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-pink-500 transition-colors"
               >
                 <Instagram className="h-5 w-5" />
               </a>
               <a 
                 href="https://wa.me/0765443843" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-green-500 transition-colors"
               >
                 <MessageCircle className="h-5 w-5" />
               </a>
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  House Plans
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Free Plans
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@estateplans.com</li>
              <li>Phone: 0765443843</li>
              <li>Address: 123 Plan Street</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Estate Plans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 