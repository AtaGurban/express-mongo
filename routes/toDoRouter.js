const Router = require('express')
const ToDoControllers = require('../controllers/ToDoControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')


router.post('/', authMiddleware, ToDoControllers.createToDo)


module.exports = router