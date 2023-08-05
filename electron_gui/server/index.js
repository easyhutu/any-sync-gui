const express = require('express')
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')
const {router} = require('./router')
const {syncWSMng} = require('./servive')
const {basename} = require('path')
const {resourcesPath, distPath} = require('./config')

const appSrv = express()

function handleExpress(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept')

    next()
}

expressWs(appSrv)

appSrv.use(express.json())
appSrv.use(express.urlencoded({extended: true}))

appSrv.use(cookieParser())
appSrv.use(handleExpress)
appSrv.use(router)


appSrv.use('/dl',express.static(resourcesPath, {
    setHeaders: (res, p) => {
        res.set('Content-Type', 'application/octet-tream')
        let realName = basename(p).substring(33)
        console.log('real name', realName)
        res.set('Content-disposition', `attachment;filename=${realName}`)
    }
}))

appSrv.use(express.static(distPath))

var syncWsM = syncWSMng.newSyncWsManager(appSrv)
syncWsM.listenClientConnect()

global.SYNCWS = syncWsM

module.exports = {
    appSrv
}