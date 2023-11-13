const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const toDoRouter = require('./toDoRouter')

router.use('/user', userRouter) 
router.use('/todo', toDoRouter) 

module.exports = router