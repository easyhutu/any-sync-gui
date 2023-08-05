const route = require('express')
const service = require('./servive')

const router = route.Router()

router.get('/ping', service.ping.pingDev)
router.get('/localInfo', service.ping.localInfo)
router.get('/setting', service.anySetting.getSetting)
router.post('/setting', service.anySetting.setSetting)
router.post('/translate', service.anySetting.transInfo)
router.post('/upload', service.upload.uploadHandler.single('file'), service.upload.uploadFunc)

router.get('/', function (req, res) {
    res.redirect('/index.html')
})

module.exports = {
    router
}