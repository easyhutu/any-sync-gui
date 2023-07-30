const {newDevice} = require('./device')


class Devices {
    constructor() {
        this.dev = null
        this.devs = null
        this.pingSecond = null
    }

    checkDev(devId, show, cate) {
        let isExist = false
        let newDevs = []
        let newDev = null
        this.devs.forEach((val) => {
            if (devId === val.devId) {
                isExist = true
                val.lastTime = Date.now()
                newDev = val
            }

            if (Date.now()-val.lastTime-this.pingSecond*1000 < 0) {
                newDevs.push(val)
            }
        })
        if (!isExist) {
            newDev = newDevice(devId, show, cate)
            newDevs.push(newDev)
        }
        this.devs = newDevs

        let callDevs = new Devices()
        let spDevs = []
        callDevs.dev = newDev
        this.devs.forEach((val) => {
            if (val.devId !== newDev.devId) {
                spDevs.push(val)
            }
        })
        callDevs.devs = spDevs
        return callDevs
    }


}

function newDevices(pingSecond) {
    const devices = new Devices()
    devices.pingSecond = pingSecond
    devices.devs = []
    return devices
}


module.exports = {
    Devices,
    newDevices,
}