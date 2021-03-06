const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create new users
router.post('/users', async (request, response) => {
    const user = new User(request.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({ user, token })
    } catch (error) {
        console.log(error)
        response.status(400).send(error)
    }
})

// Logging in
router.post('/users/login', async (request, response) => {
  console.log(request.body.email)
  console.log(request.body.password)
    try {
        const user = await User.findByCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken()
        response.send({ user, token })

    } catch (error) {
        response.status(400).send()
    }
})

// Loggin out
router.post('/users/logout', auth, async (request, response) => {
    try {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token
        })
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router