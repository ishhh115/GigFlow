import { useState, useEffect } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'
import useDebounce from '../hooks/useDebounce'
import { useAuth } from '../context/AuthContext'
import CreateLeadModal from '../components/CreateLeadModal'

interface Lead {
  _id: string
  name: string
  email: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  source: 'Website' | 'Instagram' | 'Referral'
  createdAt: string
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-red-100 text-red-700'
}

const Dashboard = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (status) params.append('status', status)
      if (source) params.append('source', source)
      params.append('sort', sort)
      params.append('page', page.toString())

      const res = await api.get(`/leads?${params.toString()}`)
      setLeads(res.data.leads)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [debouncedSearch, status, source, sort, page])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    try {
      await api.delete(`/leads/${id}`)
      fetchLeads()
    } catch (err) {
      console.error(err)
    }
  }

  const handleExport = async () => {
    const res = await api.get('/leads/export/csv', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'leads.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
            <p className="text-sm text-gray-400">{total} total leads</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              + Add Lead
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={handleExport}
                className="text-sm border border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 min-w-48"
          />

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No leads found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                  {user?.role === 'admin' && (
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <CreateLeadModal
            onClose={() => setShowModal(false)}
            onCreated={fetchLeads}
          />
        )}

      </div>
    </div>
  )
}

export default Dashboard