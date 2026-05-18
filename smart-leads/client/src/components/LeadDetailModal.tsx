interface Lead {
  _id: string
  name: string
  email: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  source: 'Website' | 'Instagram' | 'Referral'
  createdAt: string
}

interface Props {
  lead: Lead
  onClose: () => void
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-red-100 text-red-700'
}

const LeadDetailModal = ({ lead, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Name</p>
            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Email</p>
            <p className="text-sm text-gray-600">{lead.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Status</p>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
              {lead.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Source</p>
            <p className="text-sm text-gray-600">{lead.source}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Created At</p>
            <p className="text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default LeadDetailModal