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
            <b-alert show variant="primary">
              <span style="font-size: 14px">
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




            </b-alert>
            <b-badge style="color: dimgrey" variant="light">选择设备发起同步</b-badge>

            <b-list-group style="text-align: left">
              <b-list-group-item :active="de.devId===choiceDev" class="devListGroup" v-for="de in devs" :href="'#'"
                                 @click="clickChoiceDev(de.devId)"
                                 :id="de.devId" :key="de.devId">
                <b-avatar style="color: aquamarine;" size="sm" variant="secondary"
                          :icon="genDevIcon(de.cate)"></b-avatar>
                {{ de.show }}
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
              <span>{{ syncCard.fromShow }}</span>
              <span style="float: right; font-size: xx-small">{{ formatTime(syncCard.syncTime) }}</span>
            </b-card-sub-title>
            <b-card-text style="margin-top: 8px" class="user-select-all">{{ syncCard.syncDetails[0].content }}
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
              <span>{{ syncCard.fromShow }}</span>
              <span style="float: right; font-size: xx-small">{{ formatTime(syncCard.syncTime) }}</span>
            </b-card-sub-title>
            <b-card-text>
              <b-list-group style="margin-top: 10px">
                <b-list-group-item v-for="(syncDetail, didx) in syncCard.syncDetails" :key="didx"
                                   class="d-flex justify-content-between align-items-center">
                  <span>
                    <b-icon icon="image-fill"></b-icon>
                    &nbsp;
                    <a download :href="genUrl('/'+syncDetail.fileHash)">{{ syncDetail.show }}</a>
                    &nbsp;
                    <b-badge variant="primary" pill>{{ syncDetail.fileSize }}</b-badge>
                  </span>


                  <b-badge pill @click="clickPreview(syncDetail.fileHash, syncDetail.fileExt)" href="#" variant="info">
                    查看
                  </b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-card-text>

          </b-card>
        </b-col>
      </b-row>

      <b-modal scrollable size="xl" hide-footer v-model="showPreviewModal">
        <div style="text-align: center" class="d-block text-center">
          <b-img style="max-width: 480px;max-height: 720px; height: auto;width:auto" v-show="showPreviewCd()==='img'"
                 thumbnail fluid :src="previewDetail.url" :alt="previewDetail.ext"></b-img>
          <video style="width: 100%;height: 100%" controls autoplay :src="previewDetail.url"
                 v-show="showPreviewCd()==='video'"></video>
          <a v-show="showPreviewCd()==='other'" :href="previewDetail.url" download>文件类型不支持预览，点击下载</a>
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
      listenPort: 8081,
      shareUrl: '',
      dev: {},
      devs: [],
      choiceDev: null,
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
      },
      showPreviewModal: false,
      previewDetail: {url: null, ext: ''},

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
    dlEvent(url) {
      console.log('url', url)
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.send()
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
    clickPreview(fileHash, fileExt) {
      this.showPreviewModal = true
      this.previewDetail.ext = fileExt
      this.previewDetail.url = this.genUrl('/' + fileHash)
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
      return date.toTimeString()
    },
    clickChoiceDev: function (devId) {
      this.choiceDev = devId
      console.log(devId)

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
      this.$http.get(this.genUrl('/ping')).then(resp => {
        console.log(resp.data)
        this.initWsEvent()
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

</style>