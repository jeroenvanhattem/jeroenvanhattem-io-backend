const mongoose = require('mongoose')
const validator = require('validator')

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  techniques: [{
    type: String,
    required: true,
    trim: true
  }],
  image: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project