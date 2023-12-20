const route = require('express')
const service = require('./servive')

const router = route.Router()

router.get('/ping', service.ping.pingDev)
router.get('/localInfo', service.ping.localInfo)
router.get('/setting', service.anySetting.getSetting)
router.post('/setting', service.anySetting.setSetting)
router.post('/translate', service.anySetting.transInfo)
router.post('/upload', service.upload.uploadHandler.single('file'), service.upload.uploadFunc)
router.post('/download/master', service.upload.downloadFileMaster)

router.get('/openapi/batchDevices', service.openApi.batchDevices)
router.post('/openapi/openUrl', service.openApi.openUrl)

router.get('/', function (req, res) {
    let params = req.query.masterId ? `#/?masterId=${req.query.masterId}` : ''
    res.redirect(`/index.html${params}`)
})

module.exports = {
    router
}