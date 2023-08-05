const {kvStore, baiduTrans} = require('../utils')
const {anySetting} = require("./index");

function getSetting(req, res) {
    res.send(kvStore.val)
}

function setSetting(req, res) {
    // content:{baiduAppid, baiduSecret, enableBaiduTrans}
    kvStore.set(baiduTrans.baiduCfgKey,
        new baiduTrans.baiduCfg(
            req.body.baiduAppid, req.body.baiduSecret, req.body.enableBaiduTrans).withCfgParam())
    global.SYNCWS.sendGroupMsg(req.body.groupId, {msgEvent: 'anySetting', cfg: req.body})
    res.send('success')
}

function transInfo(req, res){
    let text = req.body.text
    baiduTrans.transAutoToZh(text).then((val)=>{
        res.send(val)
    })
}

module.exports = {
    getSetting, setSetting, transInfo
}