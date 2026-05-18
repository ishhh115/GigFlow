import { Response } from 'express'
import { ILead } from '../models/Lead'

export const exportToCSV = (leads: ILead[], res: Response) => {
  
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At']

  
  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toLocaleDateString()
  ])

  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

 
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
  res.send(csvContent)
}