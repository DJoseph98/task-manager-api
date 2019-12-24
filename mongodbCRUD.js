//CRUD Create Read Update Delete

//ODM -> Object Document Mapper

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
//     | 
//    \ / Raccourci
//     |
const { MongoClient, ObjectID } = require('mongodb')

const id = new ObjectID() // 4 bytes timesstamp + 5 byte random value + 3 byte counter
//console.log(id)
//console.log(id.getTimestamp())
// console.log(id.id.length)
// console.log(id.toHexString().length)

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser:  true}, (error, client) => {
    if(error){
        console.log(error)
    }

   const db = client.db(databaseName) //va se connecter ou créer la base de donnée si existe pas

//          CREATE
//         
//    db.collection('users').insertOne({ //insert une collection (table) users
//        name: 'Anna',
//        age: '28'
//    }, (error, result) => {
//         if(error){
//             return console.log(error)
//         }

//         console.log(result.ops) //renvoi un tableau regroupant mes données insérées
//    })

    //      READ
    //
    // db.collection('users').findOne({_id: new ObjectID("5cebdf1d49282f1706c0e66c")}, (error, result) => {
    //     if(error){
    //         return console.log(error)
    //     }

    //     console.log(result)
    // })

    // db.collection('users').find({ age: '26'}).toArray((error, users) => { //ressort un jeux de résultat sous forme d'array, find retourne un pointer
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(users)
    // })

    //-------------------------------------------------------EXO-------------------------------------------------------------
    // db.collection('tools').findOne({ _id: new ObjectID("5cebb2ce24c02814d1b91f95")}, (error, id) => {
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(id)
    // })                                                                                         

    // db.collection('tools').find({ completed: true }).toArray((error, completed) => {
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(completed)
    // })
    //---------------------------------------------------------------------------------------------------------------------

    //      UPDATE with promise

    // updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("5ceb9d91b8ee131258e03c32")
    // }, {
    //     $set: {
    //         age: 'Marine'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(result)
    // })

    // updatePromise = db.collection('tools').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(result)
    // })

    //          DELETE

    // updatePromise = db.collection('users').deleteMany({
    //     age: 26
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(result)
    // })

  /*   updatePromise = db.collection('users').deleteOne({
        name: 'Anna'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(result)
    }) */
})