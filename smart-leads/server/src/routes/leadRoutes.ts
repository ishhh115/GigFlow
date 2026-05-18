import express from 'express'
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeads
} from '../controllers/leadController'
import protect, { adminOnly } from '../middleware/auth'

const router = express.Router()

router.post('/', protect, createLead)
router.get('/export/csv', protect, adminOnly, exportLeads)
router.get('/', protect, getLeads)
router.get('/:id', protect, getLead)
router.put('/:id', protect, updateLead)
router.delete('/:id', protect, adminOnly, deleteLead)

export default router