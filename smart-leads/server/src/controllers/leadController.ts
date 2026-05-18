import { Response } from 'express'
import Lead from '../models/Lead'
import { AuthRequest } from '../types/index'

// CREATE LEAD
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user?._id
    })

    res.status(201).json({ message: 'Lead created successfully', lead })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET ALL LEADS 
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = 1 } = req.query

    const query: any = {}

    if (status) query.status = status
    if (source) query.source = source
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const sortOrder = sort === 'oldest' ? 1 : -1
    const pageNumber = Number(page)
    const limit = 10
    const skip = (pageNumber - 1) * limit

    const total = await Lead.countDocuments(query)
    const leads = await Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')

    res.status(200).json({
      leads,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET SINGLE LEAD
export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email')

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' })
      return
    }

    res.status(200).json({ lead })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// UPDATE LEAD
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' })
      return
    }

    res.status(200).json({ message: 'Lead updated successfully', lead })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE LEAD
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' })
      return
    }

    res.status(200).json({ message: 'Lead deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

import { exportToCSV } from '../utils/csvExport'

// CSV EXPORT
export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({})
    exportToCSV(leads, res)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}