const path = require('path')
const fs = require("fs");
require('dotenv').config()

const isDebug = process.env.NODE_ENV === 'debug'

const cfgFilePath = isDebug ? 'any_sync_cfg.json' : path.join(process.resourcesPath, 'any_sync_cfg.json')
console.log('cfg file', cfgFilePath)

function jsonParseIgnoreErr(val) {
    try {
        return JSON.parse(val)
    } catch (e) {
        console.log('parse json err:', e)
        return {}
    }
}

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
        try {
            const data = fs.readFileSync(cfgFilePath, 'utf-8')
            this.val = jsonParseIgnoreErr(data)
        } catch (e) {
            console.log('read cfg err:', e.message)
        }
        this.val[k] = v
        this._save_file()
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
                fs.writeFileSync(cfgFilePath, JSON.stringify(this.val))
            } else {
                const data = fs.readFileSync(cfgFilePath, 'utf-8')
                this.val = jsonParseIgnoreErr(data)
                console.log('load cfg', JSON.stringify(this.val))
            }
        } catch (e) {
            console.log(`init cfg file err: ${e}`)
        }
    }

    _save_file() {
        try {
            fs.writeFileSync(cfgFilePath, JSON.stringify(this.val))
        } catch (e) {
            console.log('write cfg err:', e.message)
        }
    }
}

function getWithFile(k) {
    try {
        const data = fs.readFileSync(cfgFilePath, 'utf-8')
        return jsonParseIgnoreErr(data)[k]
    } catch (e) {
        console.log('read cfg err:', e.message)
        return undefined
    }
}

module.exports = {
    kvStore: new KvStore(),
    getWithFile
}
