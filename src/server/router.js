const route = require('express')
const service = require('./servive')

const router = route.Router()

router.get('/ping', service.ping.pingDev)
router.get('/localInfo', service.ping.localInfo)

module.exports = {
    router
}