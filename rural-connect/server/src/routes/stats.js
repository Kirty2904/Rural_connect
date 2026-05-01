import { Router } from 'express'
import User from '../models/User.js'
import Worker from '../models/Worker.js'
import Job from '../models/Job.js'

const router = Router()

router.get('/', async (_req, res) => {
  const [totalWorkers, activeJobs, completedJobs, totalUsers] = await Promise.all([
    Worker.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    Job.countDocuments({ status: 'completed' }),
    User.countDocuments(),
  ])

  const skillGaps = await Worker.aggregate([
    {
      $group: {
        _id: '$address.city',
        carpenters: { $sum: { $cond: [{ $eq: ['$skill', 'Carpenter'] }, 1, 0] } },
        plumbers: { $sum: { $cond: [{ $eq: ['$skill', 'Plumber'] }, 1, 0] } },
        tailors: { $sum: { $cond: [{ $eq: ['$skill', 'Tailor'] }, 1, 0] } },
        farmers: { $sum: { $cond: [{ $eq: ['$skill', 'Farmer'] }, 1, 0] } },
      },
    },
    { $project: { region: '$_id', carpenters: 1, plumbers: 1, tailors: 1, farmers: 1, _id: 0 } },
  ])

  const workerDistribution = await Worker.aggregate([
    { $group: { _id: '$skill', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } },
  ])

  res.json({ totalWorkers, activeJobs, completedJobs, totalUsers, skillGaps, workerDistribution })
})

export default router

