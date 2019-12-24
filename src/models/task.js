const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true,

    },
    completed : {
        type: Boolean,
        default: false
    },
    userId : {
        type: mongoose.SchemaTypes.ObjectId, //dire que c'est l'id d'un object (user)
        require: true,
        ref: 'User' // créer une référence avec le model user, on peut maintenant récupérer toute les informations du user depuis le task model
    }
}, {
    timestamps:true //rajoute date création et modification
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task