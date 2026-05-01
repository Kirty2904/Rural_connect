import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Dashboard = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState(null)

  const stats = statsData
    ? [
        { label: t('dashboard.stats.totalWorkers'), value: statsData.totalWorkers, icon: '👷', color: 'from-rural-green-500 to-rural-green-600' },
        { label: t('dashboard.stats.activeJobs'), value: statsData.activeJobs, icon: '💼', color: 'from-sky-blue-500 to-sky-blue-600' },
        { label: t('dashboard.stats.completedJobs'), value: statsData.completedJobs, icon: '✅', color: 'from-amber-500 to-amber-600' },
        { label: t('dashboard.stats.totalUsers'), value: statsData.totalUsers, icon: '👥', color: 'from-purple-500 to-purple-600' },
      ]
    : []

  const skillGapsData = statsData?.skillGaps || []

  const workerDistributionData = (statsData?.workerDistribution || []).map((d) => ({ ...d, color: '#22c55e' }))

  const activityData = [
    { month: 'Jan', jobs: 120, workers: 80 },
    { month: 'Feb', jobs: 145, workers: 95 },
    { month: 'Mar', jobs: 180, workers: 110 },
    { month: 'Apr', jobs: 165, workers: 105 },
    { month: 'May', jobs: 200, workers: 130 },
    { month: 'Jun', jobs: 220, workers: 140 },
  ]

  useEffect(() => {
    let mounted = true
    api
      .get('/api/stats')
      .then(({ data }) => {
        if (!mounted) return
        setStatsData(data)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-earthy-beige-50 py-8">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earthy-beige-50 py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-bold text-gray-800 mb-8"
        >
          {t('dashboard.title')}
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`card bg-gradient-to-br ${stat.color} text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="text-5xl opacity-80">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Gaps by Region */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-6">
              {t('dashboard.charts.skillGaps')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillGapsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carpenters" fill="#22c55e" />
                <Bar dataKey="plumbers" fill="#0ea5e9" />
                <Bar dataKey="tailors" fill="#ec4899" />
                <Bar dataKey="farmers" fill="#84cc16" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Worker Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-6">
              {t('dashboard.charts.workerDistribution')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workerDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workerDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Activity Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="font-heading text-2xl font-bold text-gray-800 mb-6">
            {t('dashboard.charts.activityMetrics')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#22c55e"
                strokeWidth={3}
                name="Jobs Posted"
              />
              <Line
                type="monotone"
                dataKey="workers"
                stroke="#0ea5e9"
                strokeWidth={3}
                name="Active Workers"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard


