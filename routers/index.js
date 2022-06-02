const {getTokenAuth} = require('../middleware')

const router = require('express').Router();
router.use('/auth',require('./authRoutes'))
router.use('/chats',require('./chatRoutes'))

module.exports= router