const Router = require('express')
const UserControllers = require('../controllers/UserControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')


router.get('/auth', authMiddleware, UserControllers.check)
router.post('/registration',  UserControllers.registration)
router.post('/login',  UserControllers.login)


module.exports = router