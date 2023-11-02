const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const toDoRouter = require('./toDoRouter')

router.use('/user', userRouter) 
router.use('/to-do', toDoRouter) 

module.exports = router