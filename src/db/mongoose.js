const mongoose = require('mongoose')

mongoose.connect('mongodb://' + process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

