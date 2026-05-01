import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    area: String,
    street: String,
    city: String,
    state: String,
  },
  budget: Number,
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)

