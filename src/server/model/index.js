const {Device} = require('./device')
const {newDevices} = require('./devices')

global.devicesInfo = newDevices(60*15)

module.exports = {
    Devs: global.devicesInfo,

    Device
}