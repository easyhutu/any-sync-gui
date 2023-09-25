const {kvStore, baiduTrans} = require('../utils')
const {Devs} = require("../model");

function getSetting(req, res) {
    res.send(kvStore.val)
}

function setSetting(req, res) {

    let mode = req.body.mode
    if (mode === 'baiduCfg'){
        let baiduCfg = req.body.baiduCfg
        kvStore.set(baiduTrans.baiduCfgKey,
            new baiduTrans.baiduCfg(
                baiduCfg.baiduAppid, baiduCfg.baiduSecret, baiduCfg.enableBaiduTrans).withCfgParam())
        global.SYNCWS.sendGroupMsg(req.body.groupId, {msgEvent: 'anySetting', cfg: req.body})
    }
    if (mode === 'captureCfg'){
        let captureCfg = req.body.captureCfg
        kvStore.set('captureCfg', captureCfg)
    }
    if (mode === 'clearSync'){
        Devs.clearSync()
        global.SYNCWS.sendGroupMsg(req.body.groupId, {msgEvent: 'pingGroup', cfg: req.body})
    }

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