import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  area: String,
  street: String,
  city: String,
  state: String,
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true },
  password: { type: String },
  googleId: { type: String },
  location: addressSchema,
  role: { type: String, enum: ['worker', 'employer'], required: true },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
