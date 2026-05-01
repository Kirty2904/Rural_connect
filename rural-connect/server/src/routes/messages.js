import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import Message from '../models/Message.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  const { withUser } = req.query
  if (!withUser) return res.status(400).json({ message: 'withUser is required' })
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: withUser },
      { senderId: withUser, receiverId: req.user._id },
    ],
  }).sort({ timestamp: 1 })
  res.json(messages)
})

router.post('/', auth, async (req, res) => {
  const { receiverId, message } = req.body
  const msg = await Message.create({ senderId: req.user._id, receiverId, message })
  res.json(msg)
})

export default router

