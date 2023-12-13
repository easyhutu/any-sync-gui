const {Devs} = require('./../model')
const {getDeviceInfo} = require('./../utils')
const fs = require('fs')
const path = require('path')
const {resourcesPath} = require('./../config')

const MsgType = {
    ping: 'ping',
    pingGroup: 'pingGroup',
    sync: 'sync',
    anySetting: 'anySetting',
    capture: 'capture',
    openUrl: 'openUrl'
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
            console.log('send success')
        }
    }

    sendGroupMsg(groupId, msg) {
        console.log(`send group[${groupId}] msg:${JSON.stringify(msg)}`)
        Object.values(this.clients[groupId]).forEach(ws => {
            ws.send(JSON.stringify(msg))
        })
    }


    sendMasterDevMsg(type, msg) {
        let dev = Devs.getMasterDev()
        if (type === 'capture') {
            let filename = 'any-sync-screen-capture.png'
            fs.writeFile(
                path.join(resourcesPath, filename),
                new Buffer.from(msg.replace('data:image/png;base64,', ''), 'base64'),
                (err) => {
                    if (!err) {
                        let fileHash = `dl/${filename}`
                        Devs.uploadEvent(dev.devId, filename, fileHash, msg.length)
                        this.sendMsg(dev.groupId, dev.devId, {msgEvent: MsgType.capture, fileHash: fileHash})
                    } else {
                        console.log('save capture err', err)
                    }
                })
        }
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
        let content = msgObj.content

        switch (msgEvent) {
            case MsgType.ping: {
                console.log('online devs:', Object.keys(this.clients[groupId]))
                let devs = Devs.checkDev(
                    devInfo.deviceId,
                    devInfo.show,
                    devInfo.cate,
                    Object.keys(this.clients[groupId]),
                    null,
                    groupId
                )

                this.sendMsg(groupId, devInfo.deviceId, {msgEvent: MsgType.sync, devs})
                break
            }
            case MsgType.pingGroup: {
                this.sendGroupMsg(groupId, {msgEvent: MsgType.ping})
                break
            }
            case MsgType.sync: {
                //content:{toDevId, syncType, content, fileHash}
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