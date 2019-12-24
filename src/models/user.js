const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwtk = require("jsonwebtoken")
const Task = require('./task')
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, // unique
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positif')
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (validator.contains(value, 'password')) {
                throw new Error('Enter password without password string')
            }
        }

    },
    avatar: {
        type: Buffer // type stockage 
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]

}, {
    timestamps: true //rajoute date création et modification
})

userSchema.virtual('tasks', { //permet de créer une relation entre 2 models sans créer de paramètres spécifiques dans mes models ---> virtual siginifie que rien n'est stocker dans le model
    ref: 'Task',  // model à référencer
    localField: '_id', // id de mon user
    foreignField: 'userId' //champ qui va faire la relation
})

userSchema.methods.generateAuthToken = async function () { //accessible par l'instance
    const user = this
    const token = jwtk.sign({ _id: user._id.toString() }, process.env.JWT_SECRETKEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () { // chaque fois que express prendra un json de user, il appliquera cette methode
    const user = this
    const userObject = user.toObject()

    delete userObject.password  // enlever json response password
    delete userObject.tokens // enlever json response token
    delete userObject.avatar // enlever json response avatar
    return userObject

}

userSchema.statics.findByCredential = async (email, password) => { //accessible par le model
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Enable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Enable to login')
    }

    return user
}

userSchema.pre('save', async function (next) { //action a executer avant la modification de la donnée 
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log('passmodifier')
    }

    next()
})

//Supprimer taches de l'utilisateur quand utilisateur supprimé

userSchema.pre('remove', async function (next) { //action a executer avant la modification de la donnée 
    const user = this
    await Task.deleteMany({ userId: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User