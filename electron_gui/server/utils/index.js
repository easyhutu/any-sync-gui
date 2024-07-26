const crypto = require('crypto')
const os = require('os')
const {kvStore, getWithFile} = require('./kvStore')
const baiduTrans = require('./baiduTrans')

function getDeviceInfo(req) {
    let ua = req.get('User-Agent')
    let cate = 'pc'
    let phoneKey = ['iphone', 'android', 'ipad', 'pad']
    phoneKey.forEach(function (k) {
        if (ua.toLowerCase().indexOf(k) !== -1) {
            cate = 'phone'
        }
    })

    let devInfo = {
        deviceId: req.cookies.deviceId,
        show: ua.split(") ")[0] + ")",
        setCookie: false,
        name: 'deviceId',
        cate: cate
    }

    if (!devInfo.deviceId) {
        let md5o = crypto.createHash('md5')
        md5o.update(req.get('User-Agent'))
        devInfo.setCookie = true
        devInfo.deviceId = md5o.digest('hex')
    }
    return devInfo

}

function getLocalDeviceIp() {
    const ipInfo = os.networkInterfaces()

    let ip = ''
    let netKeys = Object.keys(ipInfo).sort()
    try {
        for (const netKey of netKeys) {
            for (const value of ipInfo[netKey]) {
                if (value.family === 'IPv4' && value.address !== '127.0.0.1' && !value.internal) {
                    ip = value.address
                    break
                }
            }
            if (ip && ip.length > 0) {
                break
            }

        }
    } catch (e) {

    }
    return ip
}


module.exports = {
    getDeviceInfo,
    getLocalDeviceIp,
    kvStore,
    baiduTrans,
    getWithFile
}