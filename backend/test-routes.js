const express = require('express')
const app = express()

// Test route to verify the server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' })
})

// Test auth route
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth test route working',
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`)
}) 