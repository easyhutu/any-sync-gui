const request = require('request')
const {kvStore} = require('./kvStore')


const baiduCfgKey = 'baiduCfg'

class baiduCfg {
    constructor(appId, secret, enableBaiduTrans) {
        this.appId = appId
        this.secret = secret
        this.enableBaiduTrans = enableBaiduTrans
    }

    withCfgParam() {
        return {
            "grant_type": "client_credentials",
            "baiduAppid": this.appId,
            "baiduSecret": this.secret,
            'enableBaiduTrans': this.enableBaiduTrans,
        }
    }
}

async function transAutoToZh(content) {
    let tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token'
    let cfg = kvStore.get(baiduCfgKey)
    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + cfg.baiduAppid + '&client_secret=' + cfg.baiduSecret,
    }

    let access_token = await new Promise((resolve, reject) => {
        request(null, options, (error, response) => {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(response.body).access_token)
            }
        })
    })
    let transOptions = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token=' + access_token,
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "from": "auto",
            "to": "zh",
            "q": content
        })

    };

    return new Promise((resolve, reject)=>{
        request(transOptions, function (error, response) {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(response.body))
            }
        });
    })
}


module.exports = {
    baiduCfg, transAutoToZh, baiduCfgKey
}