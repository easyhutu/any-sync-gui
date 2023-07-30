const {Devs} = require('./../model')
const {getDeviceInfo} = require('./../utils')

class SyncWsManager {
    constructor(server) {
        this.clients = {}
        this.server = server

    }
    /**
     * 接受client端连接
     */
    listenClientConnect() {

        this.server.ws('/ws/sync/:groupId', (ws, req)=> {
            let groupId = req.params.groupId
            let devInfo = getDeviceInfo(req)
            if (!groupId || !devInfo){
                ws.send('need group id, dev id')
                ws.close()
                return
            }

            console.log(`group[${groupId}] client[${devInfo.deviceId}] connect to server successful!`);
            this.clients[groupId][devInfo.deviceId] = ws;
            ws.on('message', (msg)=> {
                console.log("receive client msg :", msg);
                this.receiveMsg(groupId, devInfo.deviceId, msg);
            });
            ws.on("close", ()=>{
                console.log("client is closed");
                delete this.clients[groupId][devInfo.deviceId]

            });
        });
    }
    /**
     * 发送command到client端
     * @param groupId
     * @param devId
     * @param msg
     */
    sendMsg(groupId, devId, msg){
        console.log(`send[${devId}] msg:${JSON.stringify(msg)}`)
        this.clients[groupId][devId].send(JSON.stringify(msg))
    }

    sendGroupMsg(groupId, msg){
        console.log(`send group[${groupId}] msg:${msg}`)
        Object.values(this.clients[groupId]).forEach(ws => {
            ws.send(JSON.stringify(msg))
        })
    }

    /**
     * 接收client的command请求
     * @param groupId
     * @param devId
     * @param msg
     */
    receiveMsg(groupId, devId, msg){
        console.log(`receive[${devId}] msg:${msg}`)
        this.sendMsg(groupId, devId, Devs)
    }


}

function newSyncWsManager(server) {
    return new SyncWsManager(server)
}

module.exports = {
    newSyncWsManager
}