const {Devs} = require('./../model')
const {getDeviceInfo} = require('./../utils')

const MsgType = {
    ping: 'ping',
    pingGroup: 'pingGroup',
    sync: 'sync',
}

class SyncWsManager {
    constructor(server) {
        this.clients = {}
        this.server = server

    }

    /**
     * 接受client端连接
     */
    listenClientConnect() {
        this.server.ws('/ws/sync/:groupId', (ws, req) => {
            let groupId = req.params.groupId
            let devInfo = getDeviceInfo(req)
            if (!groupId || !devInfo) {
                ws.send('need group id, dev id')
                ws.close()
                return
            }

            console.log(`group[${groupId}] client[${devInfo.deviceId}] connect to server successful!`);
            if (!this.clients[groupId]) {
                this.clients[groupId] = {}
            }
            this.clients[groupId][devInfo.deviceId] = ws;
            ws.on('message', (msg) => {
                console.log("receive client msg :", msg);
                this.receiveMsg(groupId, devInfo, msg);
            });
            ws.on("close", (msg) => {
                console.log(`ws[${devInfo.deviceId}] is closed`);
                delete this.clients[groupId][devInfo.deviceId]
                Devs.delDev(devInfo.deviceId)
                this.sendGroupMsg(groupId, {msgEvent: MsgType.ping})

            });
        });
    }

    /**
     * 发送command到client端
     * @param groupId
     * @param devId
     * @param msg
     */
    sendMsg(groupId, devId, msg) {
        console.log(`send[${devId}] msg:${JSON.stringify(msg)}`)
        if (this.clients[groupId][devId]) {
            this.clients[groupId][devId].send(JSON.stringify(msg))
        }
    }

    sendGroupMsg(groupId, msg) {
        console.log(`send group[${groupId}] msg:${JSON.stringify(msg)}`)
        Object.values(this.clients[groupId]).forEach(ws => {
            ws.send(JSON.stringify(msg))
        })
    }

    /**
     * 接收client的command请求
     * @param groupId
     * @param devInfo
     * @param msg
     */
    receiveMsg(groupId, devInfo, msg) {
        console.log(`receive[${devInfo.deviceId}] msg:${msg}`)
        let msgObj = JSON.parse(msg)
        let msgEvent = msgObj.msgEvent
        let content = msgObj.content //content:{toDevId, syncType, content, fileHash}

        switch (msgEvent) {
            case MsgType.ping: {
                let devs = Devs.checkDev(devInfo.deviceId, devInfo.show, devInfo.cate)
                this.sendMsg(groupId, devInfo.deviceId, {msgEvent: MsgType.sync, devs})
                break
            }
            case MsgType.pingGroup: {
                this.sendGroupMsg(groupId, {msgEvent: MsgType.ping})
                break
            }
            case MsgType.sync: {
                Devs.syncEvent(devInfo.deviceId, content)
                this.sendMsg(groupId, content.toDevId, {msgEvent: MsgType.ping})
                break
            }
        }
    }


}

function newSyncWsManager(server) {
    return new SyncWsManager(server)
}

module.exports = {
    newSyncWsManager
}