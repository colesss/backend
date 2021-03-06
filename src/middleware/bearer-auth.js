import * as jwt from 'jsonwebtoken'
import User from '../model/user.js'
import createError from 'http-errors'
import promisify  from '../lib/promisify.js'

export default (req, res, next) => {
  let {authorization} = req.headers
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'))

  let token = authorization.split('Bearer ')[1]
  if(!token)
    return next(createError(400, 'AUTH ERROR: not bearer auth'))

  jwt.verify(token, process.env.SECRET,(err,token) => { 
    if(err) createError(401, err)
    User.findOne({tokenSeed: token.tokenSeed})
      .then((user) => {
        if(!user)
          throw createError(401, 'AUTH ERROR: user not found')
        req.user = user
        next()
      })
  })
};
