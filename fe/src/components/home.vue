<template>
    <div>
        <b-container>
            <b-row>
                <b-col v-show="!isMobile">
                    <b-card>
                        <b-card-body>
                            <QrCodeComponent id="qrCode" :text="shareUrl" name="qrCode"></QrCodeComponent>
                        </b-card-body>

                        <b-card-text style="text-align: left">
                            扫码或访问 <span class="user-select-all">{{ shareUrl }}</span>
                        </b-card-text>
                    </b-card>

                </b-col>
                <b-col>
                    <b-card style="text-align: left">
                        <b-card text-variant="white" img-height="100px" overlay img-src="/bg.jpg">
                            <b-card-text>
                <span style="font-weight: bold;">
                {{ dev.show }}
                </span>
                                <b-badge style="float: right" variant="light">
                <span v-show="ws" style="color: cadetblue">
                   <b-icon variant="success" icon="wifi" font-scale="1.5"></b-icon>
                已连接
                </span>
                                    <span v-show="!ws" style="color: grey">
                   <b-icon icon="wifi-off" font-scale="1.5"></b-icon>
                中断
                </span>
                                </b-badge>
                            </b-card-text>
                        </b-card>

                        <b-badge style="color: dimgrey" variant="light">选择设备发起同步</b-badge>
                        <a v-show="dev.isMaster" href="javascript:void(0)" @click="clearSyncCache">
                            <b-badge pill variant="danger">清理缓存</b-badge>
                        </a>

                        <b-list-group style="text-align: left">
                            <b-list-group-item :disabled="!de.online" :active="de.devId===choiceDev"
                                               class="d-flex align-items-center"
                                               v-for="de in devs"
                                               href="javascript:void(0)"
                                               @click="clickChoiceDev(de)"
                                               :id="de.devId" :key="de.devId">
                                <b-avatar class="mr-2" style="color: aquamarine;" size="sm" variant="secondary"
                                          :icon="genDevIcon(de.cate)"></b-avatar>
                                <span class="mr-auto">{{ de.show }}</span>
                                <b-icon style="color: #9be7ac" v-show="de.online" icon="wifi"></b-icon>
                                <b-icon style="color: #4e555b" v-show="!de.online" icon="wifi-off"></b-icon>
                            </b-list-group-item>
                        </b-list-group>

                    </b-card>
                </b-col>
            </b-row>

            <b-row class="sync-input-row" style="text-align: left">
                <b-col>
                    <b-badge pill variant="warning">同步文本</b-badge>
                    <b-form-textarea
                            v-show="choiceDev"
                            v-model="syncText"
                            placeholder="输入文本..."
                            rows="3"
                            max-rows="6"
                    ></b-form-textarea>
                </b-col>
            </b-row>

            <b-row class="sync-show-row" style="text-align: left">
                <b-col>
                    <b-card style="margin-top: 8px" v-for="(syncCard, idx) in dev.syncText" :key="idx">
                        <b-card-sub-title>
                            <b-icon variant="primary" icon="messenger"></b-icon>
                            &nbsp;
                            <span style="font-size: 14px">{{ syncCard.fromShow }}</span>
                            <span style="float: right; font-size: xx-small">{{ formatTime(syncCard.syncTime) }}</span>
                        </b-card-sub-title>
                        <b-card-text style="margin-top: 8px">
                            <p v-show="!enableTranslate">
                                {{ syncCard.syncDetails[0].content }}
                            </p>
                            <a class="user-select-all" v-show="enableTranslate" @click="clickTranslate"
                               style="color: #1d2124;text-decoration: none" :id="'popover'+idx"
                               href="javascript:void(0)">{{ syncCard.syncDetails[0].content }}</a>
                            <div>
                                <b-popover v-if="enableTranslate" :target="'popover'+idx" placement="top"
                                           triggers="focus">
                                    <template #title>
                                        <b-icon icon="translate"></b-icon>
                                        <span style="font-size: small">
                                            {{ transInfo.from }}
                                            <b-icon icon="arrow-right"></b-icon>
                                            {{ transInfo.to }}
                                        </span>
                                    </template>
                                    {{ transInfo.trans_result ? transInfo.trans_result[0].dst : 'loading...' }}
                                </b-popover>
                            </div>

                        </b-card-text>
                    </b-card>

                </b-col>
            </b-row>

            <b-row class="sync-input-row" style="text-align: left">
                <b-col>
                    <b-badge pill variant="warning">同步文件</b-badge>
                    <uploader v-show="choiceDev" :options="uploadOptions" @file-success="onFileUploadSuccess"
                              class="sync-uploader">
                        <uploader-unsupport></uploader-unsupport>
                        <uploader-drop>
                            <p>拖拽文件上传或</p>
                            <uploader-btn style="margin-left: 10px">
                                <b-icon variant="primary" icon="file-earmark"></b-icon>
                                文件
                            </uploader-btn>
                            <uploader-btn style="margin-left: 10px" :attrs="uploadAttrs">
                                <b-icon variant="primary" icon="card-image"></b-icon>
                                图片
                            </uploader-btn>
                            <uploader-btn style="margin-left: 10px" :directory="true">
                                <b-icon variant="primary" icon="folder"></b-icon>
                                文件夹
                            </uploader-btn>
                        </uploader-drop>
                        <uploader-list></uploader-list>
                    </uploader>
                </b-col>
            </b-row>

            <b-row class="sync-show-row" style="text-align: left">
                <b-col style="margin-bottom: 12px">
                    <b-card v-for="(syncCard, idx) in dev.syncFile" :key="idx">
                        <b-card-sub-title>
                            <b-icon variant="primary" icon="messenger"></b-icon>
                            &nbsp;
                            <span style="font-size: 14px">{{ syncCard.fromShow }}</span>
                            <span style="float: right; font-size: xx-small">{{ formatTime(syncCard.syncTime) }}</span>
                        </b-card-sub-title>
                        <b-card-text>
                            <b-list-group style="margin-top: 10px">
                                <b-list-group-item v-for="(syncDetail, didx) in syncCard.syncDetails" :key="didx">
                                    <div style="float: left; width: 5%; margin-right: 5px">
                                        <b-icon icon="image-fill"></b-icon>
                                    </div>
                                    <div class="file-show-link" style="float: left; width: 50%">
                                        <a v-if="dev.isMaster" href="javascript:void(0)"
                                           @click="clickDownloadEvent(genUrl('/'+syncDetail.fileHash))">
                                            {{ syncDetail.show }}
                                        </a>
                                        <a v-else download :href="genUrl('/'+syncDetail.fileHash)">
                                            {{ syncDetail.show }}
                                        </a>
                                    </div>


                                    <div style="float: left; width: 10%">
                                        <b-badge variant="info" pill>{{ syncDetail.fileSize }}</b-badge>
                                    </div>
                                    <div style="float: right; text-align: right; width: 10%">
                                        <b-badge pill
                                                 @click="clickPreview(syncDetail.fileHash, syncDetail.fileExt, syncDetail.show)"
                                                 href="#"
                                                 variant="primary">
                                            查看
                                        </b-badge>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card-text>

                    </b-card>
                </b-col>
            </b-row>

            <b-modal scrollable size="xl" hide-footer v-model="showPreviewModal">
                <p>{{ previewDetail.name }}</p>
                <div style="text-align: center" class="d-block text-center show-container">
                    <b-img class="show-col" v-show="showPreviewCd()==='img'"
                           thumbnail fluid :src="previewDetail.url" :alt="previewDetail.ext"></b-img>
                    <video class="show-col" controls autoplay :src="previewDetail.url"
                           v-show="showPreviewCd()==='video'"></video>
                    <a v-show="showPreviewCd()==='other' && !dev.isMaster" :href="previewDetail.url"
                       download>文件类型不支持预览，点击下载</a>
                    <a v-show="showPreviewCd()==='other' && dev.isMaster" href="javascript:void(0)"
                       @click="clickDownloadEvent(genUrl('/'+syncDetail.fileHash))">
                        文件类型不支持预览，点击下载
                    </a>
                </div>
            </b-modal>

            <b-modal title="屏幕截图" scrollable size="xl" hide-footer v-model="showCaptureModal">
                <div style="text-align: center" class="d-block text-center show-container">
                    <b-button variant="info" v-show="choiceDev" class="mt-3" @click="shareEventCapture">
                        分享至-{{ choiceDevShow }}
                    </b-button>
                    <b-img class="show-col" thumbnail fluid :src="captureTag" alt="capture Image"></b-img>
                    <!--          <span v-html="captureTag"></span>-->
                </div>
            </b-modal>

            <b-modal title="直链调用" scrollable size="xl" hide-footer v-model="openUrlModal">
                <div style="text-align: center" class="d-block text-center show-container">
                    <b-button variant="info" class="mt-3" @click="openUrlEvent">
                        发起调用
                    </b-button>
                    <hr>
                    <h5>请求参数</h5>
                    <b-textarea max-rows="20" v-model="openUrlParams"></b-textarea>

                </div>
            </b-modal>
        </b-container>

    </div>
</template>

<script>
import QrCodeComponent from './qrCode.vue'

export default {
    name: 'HomeComponent',
    components: {
        QrCodeComponent
    },
    data() {
        return {
            settingUrl: `http://${window.location.hostname}:8081/setting`,
            listenPort: 8081,
            shareUrl: '',
            dev: {},
            devs: [],
            choiceDev: null,
            choiceDevShow: null,
            syncText: '',
            uploadOptions: {
                target: `http://${window.location.hostname}:8081/upload`,
                testChunks: false,
                chunkSize: 1024 * 1024 * 1025
            },
            uploadAttrs: {
                accept: 'image/*'
            },
            ws: null,
            wsGroupId: 1,
            wsMsgType: {
                ping: 'ping',
                pingGroup: 'pingGroup',
                sync: 'sync',
                anySetting: 'anySetting',
                capture: 'capture',
                openUrl: 'openUrl'

            },
            showPreviewModal: false,
            previewDetail: {url: null, ext: '', name: ''},
            transInfo: {},
            enableTranslate: false,
            showCaptureModal: false,
            capturePath: null,
            captureTag: '',
            openUrlModal: false,
            openUrlParams: '',
            isMobile: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        }
    },
    mounted() {
        this.getLocalInfo()
        this.pingDevice()

        // 10min 发起一次心跳，1min发起一次重试连接
        setInterval(() => {
            if (this.ws) {
                this.ws.send(JSON.stringify({msgEvent: this.wsMsgType.ping}))
            }
        }, 1000 * 60 * 10)
        setInterval(() => {
            if (!this.ws) {
                this.pingDevice()
            }
        }, 1000 * 60)
    },
    watch: {
        syncText() {
            if (this.syncText && this.choiceDev) {
                this.ws.send(JSON.stringify(
                    {
                        msgEvent: this.wsMsgType.sync,
                        content: {
                            syncType: 'text',
                            content: this.syncText,
                            toDevId: this.choiceDev
                        }
                    }
                ))
            }
        },
    },
    methods: {
        clickDownloadEvent(url) {
            this.$http.post(this.genUrl('/download/master'), {
                url: url
            }).then((resp) => {
                console.log(resp)
            })
        },
        clearSyncCache() {
            this.$http.post(this.settingUrl, {
                mode: 'clearSync',
                groupId: this.wsGroupId,
            }).then((resp) => {
                console.log(resp)
                this.$bvToast.toast('所有设备同步数据已清除', {
                    title: '提示',
                    variant: 'info',
                    solid: true,
                    autoHideDelay: 3000,
                })
            })
        },
        openUrlEvent() {
            window.open(this.openUrlParams)
        },
        shareEventCapture() {
            this.showCaptureModal = false
            this.ws.send(JSON.stringify(
                {
                    msgEvent: this.wsMsgType.sync,
                    content: {
                        syncType: 'file',
                        fileHash: this.capturePath,
                        toDevId: this.choiceDev
                    }
                }
            ))
        },
        clickTranslate() {
            let info = window.getSelection().toString()
            if (!this.enableTranslate || !info) {
                return
            }
            this.transInfo = {}
            this.$http.post(this.genUrl('/translate'), {text: info}).then((resp) => {
                console.log(resp.data)
                this.transInfo = resp.data.result ? resp.data.result : {}
            })
        },
        showPreviewCd() {
            if (['.jpg', '.png', '.jpeg', '.webp'].indexOf(this.previewDetail.ext.toLowerCase()) !== -1) {
                return 'img'
            }
            if (['.mp4', '.av', '.mov'].indexOf(this.previewDetail.ext.toLowerCase()) !== -1) {
                return 'video'
            }
            return 'other';

        },
        clickPreview(fileHash, fileExt, fileName) {
            this.showPreviewModal = true
            this.previewDetail.ext = fileExt
            this.previewDetail.url = this.genUrl('/' + fileHash)
            this.previewDetail.name = fileName
        },
        onFileUploadSuccess(rootFile, file, response) {
            console.log('upload success', response)
            this.ws.send(JSON.stringify(
                {
                    msgEvent: this.wsMsgType.sync,
                    content: {
                        syncType: 'file',
                        fileHash: response,
                        toDevId: this.choiceDev
                    }
                }
            ))
        },
        formatTime(timestamp) {
            let date = new Date(timestamp)
            return date.toTimeString().replace('(中国标准时间)', '')
        },
        clickChoiceDev: function (dev) {
            this.choiceDev = dev.devId
            this.choiceDevShow = dev.show
            console.log('choece dev', dev.devId)

        },
        genDevIcon(cate) {
            switch (cate) {
                case 'phone':
                    return 'phone'
                case 'pc':
                    return 'laptop'
            }
        },
        genUrl: function (path) {
            return `http://${window.location.hostname}:${this.listenPort}` + path
        },
        getLocalInfo: function () {
            this.$http.get(this.genUrl('/localInfo')).then(resp => {
                console.log(resp.data)
                this.shareUrl = resp.data.shareUrl
            })
        },
        pingDevice: function () {
            console.log('masterId', this.$route.query.masterId)
            this.$http.get(this.genUrl('/ping'), {params: {masterId: this.$route.query.masterId}}).then(resp => {
                console.log(resp.data)
                this.initWsEvent()
            })
            this.$http.get(this.genUrl('/setting')).then(resp => {
                this.enableTranslate = resp.data.baiduCfg ? resp.data.baiduCfg.enableBaiduTrans : false
            })
        },
        initWsEvent: function () {
            this.ws = new WebSocket(`ws://${window.location.hostname}:${this.listenPort}/ws/sync/${this.wsGroupId}`)
            this.ws.onopen = () => {
                console.log('ws连接状态：' + this.ws.readyState);
                //连接成功 ping group
                this.ws.send(JSON.stringify({msgEvent: this.wsMsgType.pingGroup}))
            }
            this.ws.onmessage = (msg) => {
                console.log('接收到来自服务器的消息：', Date.now(), msg.data);
                let msgObj = JSON.parse(msg.data)
                switch (msgObj.msgEvent) {
                    case this.wsMsgType.ping: {
                        this.ws.send(JSON.stringify({msgEvent: this.wsMsgType.ping}))
                        break
                    }
                    case this.wsMsgType.sync: {
                        this.devs = msgObj.devs.devs
                        this.dev = msgObj.devs.dev
                        break
                    }
                    case this.wsMsgType.anySetting: {
                        if (msgObj.cfg.baiduCfg) {
                            this.enableTranslate = msgObj.cfg.baiduCfg.enableBaiduTrans
                        }
                        break
                    }
                    case this.wsMsgType.capture: {
                        this.capturePath = msgObj.fileHash
                        this.captureTag = `/${this.capturePath}?t=${Date.now()}`
                        this.showCaptureModal = true
                        break
                    }
                    case this.wsMsgType.openUrl: {
                        this.openUrlParams = msgObj.url
                        if (msgObj.autoOpen) {
                            window.open(this.openUrlParams)
                        } else {
                            this.openUrlModal = true
                        }
                        break
                    }

                }
            }
            this.ws.onerror = (errmsg) => {
                console.log("ws err", errmsg)
                this.ws = null
            }
            this.ws.onclose = () => {
                console.log("ws close")
                this.ws = null
            }
        }
    }
}
</script>
<style scoped>

.sync-input-row {
    margin-top: 12px;
}

.sync-show-row {
    margin-top: 8px;
}

.file-show-link {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.show-container {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 90%;
}

.show-col {
    margin-top: 12px;
    max-height: 100%;
    max-width: 100%;
}
</style>