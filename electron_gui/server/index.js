const express = require('express')
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')
const urlencode = require('urlencode')
const {router} = require('./router')
const {syncWSMng} = require('./servive')
const {basename} = require('path')
const {resourcesPath, distPath, MasterId, ipcRemoteFunc} = require('./config')

const appSrv = express()

function handleExpress(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

    next()
}

expressWs(appSrv)

appSrv.use(express.json())
appSrv.use(express.urlencoded({extended: true}))

appSrv.use(cookieParser())
appSrv.use(handleExpress)
appSrv.use(router)


appSrv.use('/dl', express.static(resourcesPath, {
    setHeaders: (res, p) => {
        let realName = basename(p).substring(33)
        res.set('Content-disposition', `attachment;filename=${urlencode(realName)}`)
    }
}))

appSrv.use(express.static(distPath))

var syncWsM = syncWSMng.newSyncWsManager(appSrv)
syncWsM.listenClientConnect()

global.SYNCWS = syncWsM

module.exports = {
    appSrv, MasterId, syncWsM, ipcRemoteFunc
}