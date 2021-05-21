const express = require('express')
require('./database/database')
const projectRouter = require('./routers/project')
const userRouter = require('./routers/user')
const cors = require('cors')

const app = express()

app.use(express.json())

// Cors should ALWAYS come before the 'app.use(router)'. ALWAYS!
app.use(cors({credentials: true}))

app.use(projectRouter)
app.use(userRouter)

module.exports = app