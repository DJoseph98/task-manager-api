require('../db/mongoose')
const express =  require('express')
const router = new express.Router()
const User =  require("../models/user")
const auth = require("../middleware/auth")
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account') // rendre utilisable fonction envoie email

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken ()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token // retourner true pour chaque token différent de l'actuel (il va garder tout les token sauf l'actuel)
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        req.status(500).send()
    }
})

router.post('/addUser', async (req, res) => {    // route POST , app.post ==> créer
  
    const user = new User(req.body)
   
//   user.save().then(()=>{
//       res.status(202).send(user)
//   }).catch((e)=>{
//       res.status(400).send(e) // https://httpstatuses.com/
//   })
    try{
        await user.save() // await = attend avant execution suite
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/getUsers/me', auth /* middleware function */, async (req, res)=>{ //app.get ==> récupérer
    res.send(req.user)
});

router.patch('/findUserAndUpdate/me', auth, async (req, res) => { //app.patch ==> update
    const tabReqParams = Object.keys(req.body) // récupère objet param sous forme de tableau
    const tabFieldUser = Object.keys(require('mongoose').model('User').schema.obj) // récupère les champs de ma table User sous forme de tableau
    const isValidFields = tabReqParams.every((reqParam) => tabFieldUser.includes(reqParam)) //pour chaque param de requete, je check si param exist dans mon model
    
    if(!isValidFields){
        return res.status(400).send({ error:'Field not exist in User table' })
    }

    try {

        const user = req.user // récupère le user qui est actuellement connecter
        tabReqParams.forEach((update)=>user[update] = req.body[update]) // j'update tout les champs de mon objet avec la valeur de du POST

        await user.save()

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})

        res.status(202).send(user)

    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/deleteUser/me', auth, async(req, res) => {
    try {
        /* const user =  await User.findByIdAndDelete(req.user._id)
        if(!user){
            return res.status(404).send('User not found')
        } */
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({ 
    //dest: 'src/images/avatars/', //créer le répertoire ou est uploader les images -> commenter ici pour dire qu'on stock plus l'image dans un répertoire
    limits: {
        fileSize: 1000000   // limit to 1 MO
    },
    fileFilter(req, file, callback) { //filtre sur le fichier
        if (!file.originalname.match('\.(jpg|png|jpeg)$')) { // OK si images
            return callback(new Error('no NPG,JPG, JPEG format!'))
        }

        callback(undefined, true)
    }
    
})

router.post('/uploadUserAvatar', auth, upload.single('avatar' /*single.avatar -> récupère le champ avatar ou est stocker l'image*/), async (req,res) => { // auth -> upload
    
    const buffer =  await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  // utilise la lib sharp pour resize, changer format et buffer
    req.user.avatar = buffer // store dans user.avatar l'image buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => { // pour personnaliser l'erreur de retour et utiliser l'erreur défini dans upload()----> OBLIGATION 4 arguments poiur que EXPRESS sache que c'est pour handle une erreur
    res.status(400).send({ error: error.message })
})

router.delete('/deleteUserAvatar', auth, async (req, res) => {
    req.user.avatar = undefined
    try {
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.send(400).send(error)
    }
})

router.get('/getAvatar/:id', async(req, res) => { // affiche l'avatar
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar ) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports =  router // pour pouvoir utiliser la lib en dehors

