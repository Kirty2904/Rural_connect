import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import api from '../lib/api'

const Search = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [viewMode, setViewMode] = useState('list')
  const [workers, setWorkers] = useState([])
  const [filteredWorkers, setFilteredWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const skills = ['Carpenter', 'Plumber', 'Tailor', 'Farmer', 'Mason', 'Electrician']
  const locations = ['Village A', 'Village B', 'Village C', 'Village D']

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/api/workers').then(({ data }) => {
      if (!mounted) return
      const mapped = data.map((w) => {
        const address = `${w.address?.area || ''}, ${w.address?.street || ''}, ${w.address?.city || ''}, ${w.address?.state || ''}`
          .replaceAll(', ,', ',')
          .replace(/^, |, $/g, '')
        return {
          id: w._id,
          name: w.name,
          skill: w.skill,
          location: address,
          rating: w.rating || 0,
          reviews: 0,
          image: '👷',
          lat: 19.076,
          lng: 72.8777,
          experience: w.experience || '',
        }
      })
      setWorkers(mapped)
      setFilteredWorkers(mapped)
    }).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let filtered = workers

    if (searchQuery) {
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSkill) {
      filtered = filtered.filter((worker) => worker.skill === selectedSkill)
    }

    if (selectedLocation) {
      filtered = filtered.filter((worker) => worker.location === selectedLocation)
    }

    if (minRating > 0) {
      filtered = filtered.filter((worker) => worker.rating >= minRating)
    }

    setFilteredWorkers(filtered)
  }, [searchQuery, selectedSkill, selectedLocation, minRating, workers])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  return (
    <div className="py-8">
      <div className="app-shell">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">{t('search.title')}</h1>

        <div className="surface-card mb-6 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('search.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
              aria-label="Search workers"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
              🔍
            </span>
          </div>
        </div>

        <div className="surface-card mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('search.filters.skill')}
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="input-field"
              >
                <option value="">All skills</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('search.filters.location')}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('search.filters.rating')}
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="input-field"
              >
                <option value={0}>Any rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSkill('')
                  setSelectedLocation('')
                  setMinRating(0)
                }}
                className="btn-secondary w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-end space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('search.viewMode.list')}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('search.viewMode.map')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">{t('search.loading')}</p>
          </div>
        ) : viewMode === 'list' ? (
          filteredWorkers.length === 0 ? (
            <div className="surface-card py-12 text-center">
              <p className="text-slate-600 text-lg">{t('search.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <div key={worker.id} className="surface-card p-5 transition hover:shadow-md">
                  <Link to={`/profile/${worker.id}`}>
                    <div className="mb-4 text-center">
                      <div className="mb-3 text-5xl">{worker.image}</div>
                      <h3 className="text-xl font-semibold text-slate-900">
                          {worker.name}
                      </h3>
                      <p className="font-medium text-slate-600">{worker.skill}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">{t('profile.location')}</span>
                        <span className="font-medium text-slate-800 text-right">{worker.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t('profile.rating')}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(worker.rating)}
                          <span className="ml-2 font-medium text-slate-800">{worker.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t('profile.experience')}</span>
                        <span className="font-medium text-slate-800">{worker.experience || '-'}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="surface-card h-[580px] p-4">
            <MapContainer
              center={[19.0760, 72.8777]}
              zoom={10}
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredWorkers.map((worker) => (
                <Marker key={worker.id} position={[worker.lat, worker.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{worker.image}</div>
                      <h3 className="font-bold">{worker.name}</h3>
                      <p className="text-rural-green-600">{worker.skill}</p>
                      <p className="text-sm text-gray-600">{worker.location}</p>
                      <Link
                        to={`/profile/${worker.id}`}
                        className="text-slate-800 hover:underline text-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search

