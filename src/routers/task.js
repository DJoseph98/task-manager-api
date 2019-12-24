require('../db/mongoose')
const express =  require('express')
const router = new express.Router()
const Task =  require("../models/task")
const auth = require('../middleware/auth')

router.post('/addTask', auth, async (req,res) =>{
    //const task= new Task(req.body)
    const task = new Task({
        ...req.body, // spread synthax -> permet de parcourir le body et d'ajouter automatiquement les clé/valeur =====> évite d'écrire : description : 'blabla', completed : true, etc...
        userId: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/getTasks', auth, async (req, res)=>{
    
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':') //explode phps
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        //const tasks = await Task.find({ userId: req.user._id }) 
        await req.user.populate( { // récupère selon relation user/task par le champ du model
            path: 'tasks',          //dire que le chemin pour récupérer les taches est tasks
            match, // récupère les task avec completed:true
            options:{
                //---------------------Pagination-------------------------------------------------------------------------------------
                limit: parseInt(req.query.limit), // parse le string en int et limite l'affichage des tasks au nb récupérer
                skip: parseInt(req.query.skip), // parse le string en int et affiche le numéro de page
                 //-------------------------------------------------------------------------------------------------------------------
                sort/* :{ // triage
                    //createdAt: -1 //ordre descendant
                    completed: -1 //ordre par complété
                } */
            }
        }).execPopulate() // récupère selon la relation virtual entre user/task
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/getTaskById/:id', auth, async (req,res)=>{

    const _id = req.params.id
   
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, userId: req.user._id }) //r&cupère task by ID et par idUser
       
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/findTaskByIdAndUpdate/:id', auth, async(req, res) => {
    const tabReqParam = Object.keys(req.body) //body => param du JSON
    const tabFieldTask = Object.keys(require('mongoose').model('Task').schema.obj)
    const isValidFields = tabReqParam.every((reqParam) => tabFieldTask.includes(reqParam))

    if(!isValidFields){
        return res.status(400).send({ error: 'Field not exist in Task table' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
        //const task = await Task.findById(req.params.id)
        //const task =  await Task.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true })

        if(!task){
            return res.status(404).send('Task not found')
        }

        tabReqParam.forEach((update) => task[update] = req.body[update])
        await task.save()
        
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/deleteTaskById/:id', auth, async(req, res) => {
    try {
        const task =  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

        if(!task){
            return res.status(404).send('Task not found')
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports =  router // pour pouvoir utiliser la lib en dehors

