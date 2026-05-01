import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { auth } from '../middleware/auth.js'
import passport from '../config/passport.js'

const router = Router()

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['worker', 'employer']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, password, role } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role })
    const token = signToken(user._id)
    res.json({ token, user: { ...user.toObject(), password: undefined } })
  }
)

router.post('/login', body('email').isEmail(), body('password').exists(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password || '')
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
  const token = signToken(user._id)
  res.json({ token, user: { ...user.toObject(), password: undefined } })
})

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user })
})

const googleEnabled = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

router.get('/google', (req, res, next) => {
  if (!googleEnabled()) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_disabled`)
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
})
router.get(
  '/google/callback',
  (req, res, next) => {
    if (!googleEnabled()) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_disabled`)
    }
    next()
  },
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
  async (req, res) => {
    const token = signToken(req.user._id)
    res.redirect(`${process.env.CLIENT_URL}/oauth-success#token=${token}`)
  }
)

export default router

