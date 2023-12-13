const {Devs} = require("../model");
const {toBase64} = require("request/lib/helpers");

function batchDevices(req, res) {
    res.send(Devs.devs)
}

function openUrl(req, res) {
    let groupId = req.body.groupId
    let devId = req.body.devId
    let url = req.body.url
    let autoOpen = req.body.autoOpen
    console.log(groupId, devId, url)
    global.SYNCWS.sendMsg(groupId, devId, {msgEvent: 'openUrl', url: url, autoOpen: autoOpen})
    res.send('success')
}

module.exports = {
    batchDevices, openUrl
}