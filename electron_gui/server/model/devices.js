const {newDevice} = require('./device')
const {syncTypeEum}  = require('./syncInfo')


class Devices {
    constructor() {
        this.dev = null
        this.devs = null
        this.pingSecond = null
    }

    syncEvent(devId, syncContent){
        let fromDev = this.getDev(devId)
        switch (syncContent.syncType) {
            case syncTypeEum.file:{
                let upFile = fromDev.uploadFiles[syncContent.fileHash]
                syncContent['show'] = upFile.show
                syncContent['fileSize'] = upFile.fileSize
                break
            }
        }
        let newDevs = []
        console.log(`fromdev:${fromDev}, content: ${syncContent}`)
        this.devs.forEach((val)=>{
            if(syncContent.toDevId === val.devId){
                val.syncDevice(fromDev, syncContent)
            }
            newDevs.push(val)
        })
        this.devs = newDevs
    }

    getDev(devId){
        let focusDev = null
        this.devs.forEach((val)=>{
            if( val.devId === devId){
                focusDev = val

            }
        })
        return focusDev
    }

    uploadEvent(devId, filename, fileHash, fileSize){
        let newDevs = []
        this.devs.forEach((val) => {
            if (devId === val.devId) {
                val.addFile(filename, fileHash, fileSize)
            }
            newDevs.push(val)

        })
        this.devs = newDevs
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