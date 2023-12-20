const multer = require('multer')
const {getDeviceInfo} = require('./../utils')
const {Devs} = require('./../model')
const {resourcesPath, ipcRemoteFunc} = require('./../config')

const {ipcRenderer} = require('electron')

const storage = multer.diskStorage({
    fieldSize: 1024 * 1024 * 1025,
    destination: function (req, file, cb) {
        cb(null, resourcesPath)
    },
    filename: function (req, file, cb) {
        let devInfo = getDeviceInfo(req)
        if (!devInfo.deviceId) {
            return
        }

        let filename = req.body.filename.replace(' ', '')
        cb(null, devInfo.deviceId + '_' + filename);
    }

})

const uploadHandler = multer({storage})

function uploadFunc(req, res, next) {
    let devInfo = getDeviceInfo(req)
    let fileInfo = req.file
    let fileHash = `dl/${fileInfo.filename}`
    Devs.uploadEvent(devInfo.deviceId, fileInfo.filename.substring(33), fileHash, fileInfo.size)
    res.send(fileHash)
}

function downloadFileMaster(req, res, next) {
    let url = req.body.url
    ipcRemoteFunc.doFunc(url)
    res.send({status: 'ok'})
}

module.exports = {
    uploadFunc,
    uploadHandler,
    downloadFileMaster
}