const {kvStore, baiduTrans} = require('../utils')
const {Devs, formatFileSize} = require("../model");

function getSetting(req, res) {
    kvStore.val['resourceSize'] = formatFileSize(global.ResourceSize)
    console.log(kvStore.val)
    res.send(kvStore.val)
}

function setSetting(req, res) {

    let mode = req.body.mode
    if (mode === 'baiduCfg') {
        let baiduCfg = req.body.baiduCfg
        kvStore.setAndUpdate(baiduTrans.baiduCfgKey,
            new baiduTrans.baiduCfg(
                baiduCfg.baiduAppid, baiduCfg.baiduSecret, baiduCfg.enableBaiduTrans).withCfgParam())
        global.SYNCWS.sendGroupMsg(req.body.groupId, {msgEvent: 'anySetting', cfg: req.body})
    }
    if (mode === 'captureCfg') {
        let captureCfg = req.body.captureCfg
        kvStore.setAndUpdate('captureCfg', captureCfg)
    }
    if (mode === 'electronCfg') {
        let electronCfg = req.body.electronCfg
        kvStore.setAndUpdate('electronCfg', electronCfg)
    }
    if (mode === 'clearSync') {
        Devs.clearSync(
            () => {
                global.SYNCWS.sendGroupMsg(req.body.groupId, {msgEvent: 'ping'})
            }
        )
    }
    if (mode === 'sysCfg') {
        let sysCfg = req.body.sysCfg
        kvStore.setAndUpdate('sysCfg', sysCfg)
        if (sysCfg.textHistoryMaxSize) {
            global.TextHistoryMaxSize = parseInt(sysCfg.textHistoryMaxSize)
        }
    }

    res.send('success')
}

function transInfo(req, res) {
    let text = req.body.text
    baiduTrans.transAutoToZh(text).then((val) => {
        res.send(val)
    })
}

module.exports = {
    getSetting, setSetting, transInfo
}