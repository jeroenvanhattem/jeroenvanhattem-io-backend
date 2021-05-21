const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain \'password\'')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})

    if (!user) {
        throw new Error('Unable to login.')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login.')
    }

    return user
}

// Using a normal function (instead of an arrow function), because we need access to 'this'.
// This is overwriting a default Mongoose function.
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Using a normal function (instead of an arrow function), because we need access to 'this'.
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User