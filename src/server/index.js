const express = require('express')
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')
const {router} = require('./router')
const {syncWSMng} = require('./servive')
const {basename} = require('path')
const {getDeviceInfo} = require('./utils')


const appSrv = express()

function handleExpress(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    next()
}

expressWs(appSrv)

appSrv.use(cookieParser())
appSrv.use(handleExpress)
appSrv.use(router)

appSrv.use('/dl',express.static('resources', {
    setHeaders: (res, p, stat) => {
        let devInfo = getDeviceInfo(res.req)
        res.set('Content-Type', 'application/octet-tream')
        let realName = basename(p).substring(33)
        console.log('real name', realName)
        res.set('Content-disposition', `attachment;filename=${realName}`)
    }
}))

appSrv.use(express.static('dist'))

var syncWsM = syncWSMng.newSyncWsManager(appSrv)
syncWsM.listenClientConnect()

module.exports = {
    appSrv
}