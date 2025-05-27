// routes/auth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

// 模擬帳號密碼（實際應從資料庫抓）
const fakeUser = {
  id: 1,
  username: 'test',
  password: '123456',
}

// 登入
router.post('/', async (req, res) => {
  const { username, password } = req.body

  console.log(username, password)

  if (username !== fakeUser.username) {
    return res.status(401).json({ code: 1, message: 'Invalid credentials' })
  }

  const passwordHash = await bcrypt.hash(fakeUser.password, 10)
  const match = await bcrypt.compare(password, passwordHash)

  if (!match) {
    return res.status(401).json({ code: 1, message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: fakeUser.id, username: fakeUser.username },
    'secretKey',
    {
      expiresIn: '1h',
    }
  )

  res.json({ code: 0, token })
})

module.exports = router
