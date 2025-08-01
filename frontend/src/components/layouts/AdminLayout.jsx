import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import AdminHeader from '../admin/AdminHeader'
import NotificationsModal from '../NotificationsModal'

const AdminLayout = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/admin/login'
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {!isLoginPage && <AdminSidebar />}
      <main className={`${isLoginPage ? 'w-full' : 'flex-1'} overflow-auto`}>
        {!isLoginPage && (
          <AdminHeader onNotificationsClick={() => setShowNotifications(true)} />
        )}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  )
}

export default AdminLayout 