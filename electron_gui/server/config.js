const path = require('path')
const fs = require('fs')
require('dotenv').config()
const {kvStore} = require('./utils')

const isDebug = process.env.NODE_ENV === 'debug'

const MasterId = `master-${Date.now()}`

global.SrvListenPort = 8081
global.ResourceSize = 0

const resourcesPath = isDebug ? 'resources' : path.join(process.resourcesPath, 'resources')

const distPath = isDebug ? 'dist' : path.join(process.resourcesPath, 'dist')

console.log(`resource path ${resourcesPath}, dist path: ${distPath}`)
kvStore.set('sysInfo', {
    resource: resourcesPath,
    dist: distPath,
    listenPort: global.SrvListenPort,
    env: process.env.NODE_ENV
})

try {
    if (!fs.existsSync(resourcesPath)) {
        fs.mkdirSync(resourcesPath);
    } else {
        fs.readdirSync(resourcesPath).map(fileName => {
            fs.unlink(path.join(resourcesPath, fileName), err => {
                if (err) {
                    console.log('del file err', err)
                }
            })
        });
    }
} catch (err) {
    console.error('resources path err:', err);
}

class IpcWithRemote {
    constructor() {
        this.ipcRender = null
    }

    registerFunc(func) {
        this.ipcRender = func
    }

    doFunc(arg) {
        this.ipcRender(arg)
    }
}

const ipcRemoteFunc = new IpcWithRemote()

module.exports = {
    resourcesPath, distPath, MasterId, ipcRemoteFunc
}