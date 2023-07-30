const express = require('express')
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')

const {router} = require('./router')
const {syncWSMng} = require('./servive')


const appSrv = express()

function handleExpress(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    next()
}

expressWs(appSrv)

appSrv.use(cookieParser())
appSrv.use(handleExpress)

appSrv.use(router)

var syncWsM = syncWSMng.newSyncWsManager(appSrv)
syncWsM.listenClientConnect()

module.exports = {
    appSrv
}