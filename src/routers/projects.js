const express = require('express')
const Project = require('../models/project')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create new Project
router.post('/project', auth, async (request, response) => {
  const project = new Project({
    ...request.body,
  })

  console.log(request.body)

  try {
    await project.save()
    response.status(201).send(project)
  } catch (error) {
    response.status(400).send(error)
  }
})

// Read all projects
// GET /projects?completed=false
// GET /projects?limit=10&skip=10
// GET /projects?sortBy=createdAt:desc
router.get('/projects', async (request, response) => {
  const match = {}
  const sort = {}

  if (request.query.completed) {
    match.completed = request.query.completed === 'true'
  }

  if (request.query.sortBy) {
    const parts = request.query.sortBy.split(':')
    sort.completed = 1
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const projects = await Project.find()
    console.log(projects)
    response.send(projects)
  } catch (error) {
    response.status(500).send('Error ' + error)
  }
})

// Read an individual project
router.get('/projects/:id', async (request, response) => {
  // Project id
  const _id = request.params.id
  try {
    const project = await Project.findOne({ _id})

    if (!project) {
      return response.status(404).send()
    }
    response.send(project)
  } catch (error) {
    response.status(500).send()
  }
})

// Delete a project
router.delete('/projects/:id', auth, async (request, response) => {
  try {
    const project = await Project.findOneAndDelete({ _id: request.params.id})

    if (!project) {
      return response.status(404).send()
    }
    response.send(project)
  } catch (error) {
    response.status(500).send()
  }
})

module.exports = router