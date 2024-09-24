const path = require('path')
const fs = require("fs");
require('dotenv').config()

const isDebug = process.env.NODE_ENV === 'debug'

const cfgFilePath = isDebug ? 'any_sync_cfg.json' : path.join(process.resourcesPath, 'any_sync_cfg.json')
console.log('cfg file', cfgFilePath)

class KvStore {
    constructor() {
        this.val = {}
        this._load_file()
    }

    get(k) {
        return this.val[k]
    }

    set(k, v) {
        console.log('set k, v', k, v)

        fs.readFile(cfgFilePath, (err, data) => {
            if (err) {
                console.log('read cfg err:', err)
                return
            }
            this.val = JSON.parse(data.toString())
            this.val[k] = v
            fs.writeFile(cfgFilePath, JSON.stringify(this.val), (err) => {
                if (err) {
                    console.log('write cfg err:', err)
                }
            })
        })

    }

    setAndUpdate(k, v) {
        if (this.val[k]) {
            let nv = this.val[k]
            this.set(k, {...nv, ...v})
        } else {
            this.set(k, v)
        }
    }

    _load_file() {
        try {
            if (!fs.existsSync(cfgFilePath)) {
                fs.writeFile(cfgFilePath, JSON.stringify(this.val), (err) => {
                    if (err) {
                        console.log('write cfg err:', err)
                    }
                })
            } else {
                fs.readFile(cfgFilePath, (err, data) => {
                    if (err) {
                        console.log('read cfg err:', err)
                        return
                    }
                    this.val = JSON.parse(data.toString())
                    console.log('load cfg', JSON.stringify(this.val))
                })
            }
        } catch (e) {
            console.log(`init cfg file err: ${e}`)
        }
    }

}


async function getWithFile(k) {
    return await new Promise(((resolve, reject) => {
        fs.readFile(cfgFilePath, (err, data) => {
            if (err) {
                console.log('read cfg err:', err)
                reject(err)
            }
            resolve(JSON.parse(data.toString())[k])
        })
    }))
}

module.exports = {
    kvStore: new KvStore(),
    getWithFile
}