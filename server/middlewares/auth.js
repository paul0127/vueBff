// middlewares/auth.js
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ code: 1, message: 'No token provided' })

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ code: 1, message: 'Invalid token' })

    req.user = user
    next()
  })
}

module.exports = authenticateToken
