const path = require('path')
const fs = require('fs')

const isDebug = process.env.NODE_ENV === 'debug'

global.SrvListenPort = 8081

const resourcesPath = isDebug? 'resources': path.join(process.resourcesPath, 'resources')

const distPath = isDebug? 'dist': path.join(process.resourcesPath, 'dist')

try {
    if (!fs.existsSync(resourcesPath)) {
        fs.mkdirSync(resourcesPath);
    }else {
        fs.readdirSync(resourcesPath).map(fileName => {
            fs.unlink(path.join(resourcesPath, fileName), err => {
                if(err){
                    console.log('del file err', err)
                }
            })
        });
    }
} catch (err) {
    console.error('resources path err:', err);
}

module.exports = {
    resourcesPath, distPath
}