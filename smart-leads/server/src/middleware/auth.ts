import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AuthRequest } from '../types/index'

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {

    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'No token, access denied' })
      return
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }


    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    req.user = user
    next()

  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only.' })
    return
  }
  next()
}

export default protect