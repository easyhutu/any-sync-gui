
class Device {
    constructor(devId, show, cate) {
        this.devId = devId
        this.show = show
        this.cate = cate
        this.syncFile = null
        this.syncText = null
        this.lastTime = null
    }
}

function newDevice(devId, show, cate) {
    const device = new Device(devId, show, cate)
    device.syncFile = []
    device.syncText = []
    device.lastTime = Date.now()

    return device
}


module.exports = {
    newDevice
}