import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  const skills = [
    { icon: '🔨', name: 'Carpenter' },
    { icon: '🔧', name: 'Plumber' },
    { icon: '✂️', name: 'Tailor' },
    { icon: '🌾', name: 'Farmer' },
    { icon: '🧱', name: 'Mason' },
    { icon: '⚡', name: 'Electrician' },
  ]

  const steps = [
    {
      number: '01',
      title: t('home.step1.title'),
      description: t('home.step1.description'),
      icon: '🔍',
    },
    {
      number: '02',
      title: t('home.step2.title'),
      description: t('home.step2.description'),
      icon: '🤝',
    },
    {
      number: '03',
      title: t('home.step3.title'),
      description: t('home.step3.description'),
      icon: '💼',
    },
  ]

  return (
    <div className="pb-16">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 py-20">
        <div className="app-shell">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
            <p className="mb-4 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Trusted Local Hiring
            </p>
            <h1 className="mb-5 text-4xl font-semibold leading-tight md:text-6xl">{t('home.tagline')}</h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-slate-600 md:text-lg">{t('home.subtagline')}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/search" className="btn-primary">
              {t('home.findWorker')}
            </Link>
              <Link to="/post-job" className="btn-secondary">
              {t('home.joinAsWorker')}
            </Link>
            </div>
        </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="app-shell">
          <h2 className="mb-8 text-center text-2xl font-semibold md:text-3xl">{t('home.popularSkills')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {skills.map((skill) => (
              <div key={skill.name} className="surface-card p-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/5 text-2xl">
                  {skill.icon}
                </div>
                <h3 className="text-sm font-medium text-slate-700">{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="app-shell">
          <h2 className="mb-8 text-center text-2xl font-semibold md:text-3xl">{t('home.howItWorks')}</h2>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="surface-card h-full p-6"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{step.number}</p>
                <div className="mb-3 text-3xl">{step.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home






