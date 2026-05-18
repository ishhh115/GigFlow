import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">GigFlow</h1>
        <p className="text-xs text-gray-400">Smart Leads Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar