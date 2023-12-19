const {Device, formatFileSize} = require('./device')
const {newDevices} = require('./devices')

global.devicesInfo = newDevices(60 * 21)

module.exports = {
    Devs: global.devicesInfo,
    formatFileSize,
    Device
}