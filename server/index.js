const express = require('express')
const cors = require('cors')
const productsRoute = require('./routes/products')
const authRoute = require('./routes/auth')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', productsRoute)
app.use('/api/login', authRoute)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ BFF server running at http://localhost:${PORT}`)
})
