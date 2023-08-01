const {SyncInfo, syncTypeEum, SyncDetail}  = require('./syncInfo')

function formatFileSize(size){
    if(size < 1024*1024){
        return `${(size/1024).toFixed(2)}K`
    }
    return `${(size/1024/1024).toFixed(2)}M`
}

class Device {
    constructor(devId, show, cate) {
        this.devId = devId
        this.show = show
        this.cate = cate
        this.syncFile = []
        this.syncText = []
        this.uploadFiles = {}
        this.lastTime = null
    }

    addFile(filename, fileHash, fileSize){
        this.uploadFiles[fileHash] = new SyncDetail(filename, fileHash, null, formatFileSize(fileSize))
    }

    syncDevice(dev, syncContent){
        let me = []
        switch (syncContent.syncType) {
            case syncTypeEum.file:{
                me = this.syncFile
                break
            }
            case syncTypeEum.text:{
                me = this.syncText
                break
            }
            default:{
                console.log('warn sync type not support', syncContent)
            }
        }
        let newSync = [], isExist = false
        me.forEach((val)=>{
            if (val.fromDevId === dev.devId){
                val.syncDetail(syncContent.syncType, syncContent.show, syncContent.fileHash, syncContent.content, syncContent.fileSize)
                isExist = true
            }
            newSync.push(val)
        })
        if (!isExist){
            let si = new SyncInfo(dev.show, dev.devId, syncContent.syncType)
            si.syncDetail(syncContent.syncType, syncContent.show, syncContent.fileHash, syncContent.content, syncContent.fileSize)
            newSync.push(si)
        }
        switch (syncContent.syncType) {
            case syncTypeEum.file:{
                this.syncFile = newSync
                break
            }
            case syncTypeEum.text:{
                this.syncText = newSync
                break
            }

        }
    }
}

function newDevice(devId, show, cate) {
    const device = new Device(devId, show, cate)
    device.syncFile = []
    device.syncText = []
    device.uploadFiles = {}
    device.lastTime = Date.now()

    return device
}


module.exports = {
    newDevice
}