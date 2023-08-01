const route = require('express')
const service = require('./servive')

const router = route.Router()

router.get('/ping', service.ping.pingDev)
router.get('/localInfo', service.ping.localInfo)
router.post('/upload', service.upload.uploadHandler.single('file'), service.upload.uploadFunc)

router.get('/', function (req, res) {
    res.redirect('/index.html')
})

module.exports = {
    router
}