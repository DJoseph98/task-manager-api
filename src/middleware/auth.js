const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {

  try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY)
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

      if(!user){
        throw new Error()
      }

      req.token = token
      req.user = user
      next()

  } catch (error) {
      res.status(401).send({error: 'Identification requise'})
  }
}

module.exports =  auth // pour pouvoir utiliser la lib en dehors

//
// without express middleware: new request -> run route 
//
// with express middleware: new request -> do something (check si user authentifié) -> run route
//