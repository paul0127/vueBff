// routes/products.js
const express = require('express')
const axios = require('axios')
const authenticateToken = require('../middlewares/auth')
const router = express.Router()

router.get('/', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products')
    res.json({ code: 0, data: response.data })
  } catch (error) {
    res.status(500).json({ code: 1, message: 'Failed to fetch products' })
  }
})

module.exports = router
