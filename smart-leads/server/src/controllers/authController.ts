import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

//Generating JWT token for user authentication
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}

//register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

//hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10)


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'sales'
    })

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

//login existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body


    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

//check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}