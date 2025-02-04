require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000

const { initializeCounters, trackVisitor } = require('./utils/visitorHandler')
const visitRoutes = require('./routes/visitRoutes')

// MongoDB connection
const mongoURI = process.env.MONGO_URI
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Initialize counters
initializeCounters()

// Middleware to track AI visits
app.use(trackVisitor)

// Routes
app.use('/', visitRoutes)

// Start the server
app.listen(port, () => {
  console.log(`AI visit tracker running at http://localhost:${port}`)
})
