const express =  require("express")  // framework serveur
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")
const app = express()
const jwtk =  require ("jsonwebtoken")
const port = process.env.PORT

app.use(express.json()) // permet directement de transformer un json qu'on recoit en objet
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')

//const bcrypt = require('bcrypt') // lib d'encryptage de Mot de Passe