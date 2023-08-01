const {Devs} = require('./../model')
const {getDeviceInfo, getLocalDeviceIp} = require('./../utils')


function pingDev(req, res) {
    let devInfo = getDeviceInfo(req)
    if (devInfo.setCookie){
        res.cookie(devInfo.name, devInfo.deviceId)
    }
    console.log('devs:', JSON.stringify(Devs))
    res.send(Devs.checkDev(devInfo.deviceId, devInfo.show, devInfo.cate))

}

function localInfo(req, res) {
    let Info = {
        ip: getLocalDeviceIp(),
        shareUrl: `http://${getLocalDeviceIp()}:${global.SrvListenPort}`
    }
    res.send(Info)
}

module.exports = {
    pingDev,
    localInfo
}

