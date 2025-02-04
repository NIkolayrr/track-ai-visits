const express = require('express')
const { getVisitorCounts } = require('../utils/visitorHandler')

const router = express.Router()

// Route to display visitor counts
router.get('/', async (req, res) => {
  try {
    const visitorCounts = await getVisitorCounts()
    res.json(visitorCounts)
  } catch (err) {
    console.error('Error fetching visitor counts:', err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
