const Router = require('express')
const ToDoControllers = require('../controllers/ToDoControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')


router.post('/', authMiddleware, ToDoControllers.createToDo)
router.get('/', authMiddleware, ToDoControllers.getToDo)
router.get('/user', authMiddleware, ToDoControllers.getToDoByUser)
router.put('/', authMiddleware, ToDoControllers.updateToDo)
router.delete('/', authMiddleware, ToDoControllers.deleteTodo)
router.post('/img', authMiddleware, ToDoControllers.createToDoImg)
router.put('/img', authMiddleware, ToDoControllers.updateToDoImg)
router.delete('/img', authMiddleware, ToDoControllers.deleteToDoImg)


module.exports = router