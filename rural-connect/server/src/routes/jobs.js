import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import Job from '../models/Job.js'

const router = Router()

router.get('/', async (req, res) => {
  const { status } = req.query
  const q = {}
  if (status) q.status = status
  const jobs = await Job.find(q).populate('postedBy', 'name')
  res.json(jobs)
})

router.post('/', auth, async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id })
  res.json(job)
})

export default router

