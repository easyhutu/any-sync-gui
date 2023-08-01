const path = require('path')

var syncTypeEum = {
    text: 'text',
    file: 'file',

}

class SyncInfo {
    constructor(fromShow, fromDevId, syncType) {
        this.fromShow = fromShow
        this.fromDevId = fromDevId
        this.syncType = syncType
        this.syncDetails = []
        this.syncTime = null
    }

    syncDetail(syncType, show, fileHash, content, fileSize) {
        switch (syncType) {
            case syncTypeEum.text: {
                this.syncDetails = []
                this.syncDetails.push(new SyncDetail(null, null, content, null))
                break
            }
            case syncTypeEum.file: {
                this.syncDetails.push(new SyncDetail(show, fileHash, content, fileSize))
            }
        }
        this.syncTime = Date.now()
    }
}


class SyncDetail {
    constructor(show, fileHash, content, fileSize) {
        this.show = show
        this.fileHash = fileHash
        this.content = content
        this.fileSize = fileSize
        this.fileExt = show ? path.extname(show) : ''
    }
}

module.exports = {
    SyncDetail,
    SyncInfo,
    syncTypeEum,
}