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
              <span style="text-align: left;display: inline">
                {{ dev.show }}
              </span>

              <span style="float: right; display: inline">
                <b-badge variant="light">

                <span v-show="devOnline" style="color: cadetblue">
                   <b-icon variant="success" icon="wifi" font-scale="1.5"></b-icon>
                已连接
                </span>
                  <span v-show="!devOnline" style="color: grey">
                   <b-icon icon="wifi-off" font-scale="1.5"></b-icon>
                中断
                </span>

                </b-badge>
              </span>
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
              v-model="syncText"
              placeholder="输入文本..."
              rows="3"
              max-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="sync-show-row" style="text-align: left">
        <b-col>
          <b-card>
            <b-card-sub-title>
              <b-icon variant="primary" icon="messenger"></b-icon>
              &nbsp;
              <span>shebei</span>
              <span style="float: right; font-size: xx-small">2023-02-23 12:22:22</span>
            </b-card-sub-title>
            <b-card-text class="user-select-all">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</b-card-text>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="sync-input-row" style="text-align: left">
        <b-col>
          <b-badge pill variant="warning">同步文件</b-badge>
          <uploader :options="uploadOptions" class="sync-uploader">
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
        <b-col>
          <b-card>
            <b-card-sub-title>
              <b-icon variant="primary" icon="messenger"></b-icon>
              &nbsp;
              <span>shebei</span>
              <span style="float: right; font-size: xx-small">2023-02-23 12:22:22</span>
            </b-card-sub-title>
            <b-card-text>
              <b-list-group style="margin-top: 10px">
                <b-list-group-item class="d-flex justify-content-between align-items-center">
                  <span>
                    <b-icon icon="image-fill"></b-icon>
                    &nbsp;
                    <a href="#">ssfldf.jpg</a>
                    &nbsp;
                    <b-badge variant="primary" pill>128k</b-badge>
                  </span>


                  <b-badge pill href="#" variant="info">查看</b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-card-text>

          </b-card>
        </b-col>
      </b-row>
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
      devOnline: true,
      syncText: '',
      uploadOptions: {
        target: 'http://localhost:8081/upload',
        testChunks: false
      },
      uploadAttrs: {
        accept: 'image/*'
      },
      ws: null,
      wsMsgType: {
        ping: 'ping',
        pingGroup: 'pingGroup',
        sync: 'sync',
      },
      isMobile: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    }
  },
  mounted() {
    this.getLocalInfo()
    this.pingDevice()
  },
  methods: {
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
      return `http://${window.location.hostname}:${this.listenPort}`+path
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
        this.dev = resp.data.dev
        this.devs = resp.data.devs
        this.initWsEvent()
      })
    },
    initWsEvent: function () {
      this.ws = new WebSocket(`ws://${window.location.hostname}:${this.listenPort}/ws/sync`)
      this.ws.onopen = () => {
        console.log('ws连接状态：' + this.ws.readyState);
        //连接成功 ping group
        this.ws.send(JSON.stringify({type: this.wsMsgType.pingGroup}))
      }
      this.ws.onmessage = (msg) => {
        console.log('接收到来自服务器的消息：', Date.now(), msg);
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