const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  type: { type: String, required: true },
  count: { type: Number, default: 0 },
})

const Visitor = mongoose.model('Visitor', visitorSchema)

const initializeCounters = async () => {
  const visitorTypes = ['ChatGPT', 'Googlebot', 'Bingbot', 'Human']
  for (const type of visitorTypes) {
    const exists = await Visitor.findOne({ type })
    if (!exists) {
      await Visitor.create({ type, count: 0 })
    }
  }
}

const trackVisitor = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || ''
    let visitorType = 'Human'

    if (userAgent.includes('ChatGPT')) {
      visitorType = 'ChatGPT'
    } else if (userAgent.includes('Googlebot')) {
      visitorType = 'Googlebot'
    } else if (userAgent.includes('Bingbot')) {
      visitorType = 'Bingbot'
    }

    await Visitor.findOneAndUpdate({ type: visitorType }, { $inc: { count: 1 } }, { upsert: true })

    next()
  } catch (err) {
    console.error('Error tracking visitor:', err)
    next()
  }
}

const getVisitorCounts = async () => {
  const visitors = await Visitor.find({})
  const counts = {}
  visitors.forEach((visitor) => {
    counts[visitor.type] = visitor.count
  })
  return counts
}

module.exports = {
  initializeCounters,
  trackVisitor,
  getVisitorCounts,
}
