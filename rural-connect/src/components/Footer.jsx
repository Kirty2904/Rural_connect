import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="app-shell py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-base font-semibold text-slate-900">Rural Connect</h3>
            <p className="text-sm text-slate-600">
              {t('home.subtagline')}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{t('footer.about')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-slate-900 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-slate-900 transition-colors">
                  {t('nav.search')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/chat" className="hover:text-slate-900 transition-colors">
                  {t('nav.chat')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center">
          <p className="text-sm text-slate-500">
            © 2024 Rural Connect. {t('footer.rights')}
          </p>
          <p className="text-xs text-slate-400">Built for trusted local hiring.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer






