<template>
  <div>
    <div>
      <b-card no-body>
        <b-tabs
            content-class="mt-3"

            vertical
            card
            pills
            justified
            active-nav-item-class="font-weight-bold text-uppercase text-warning bg-info"
            active-tab-class="font-weight-bold"
        >
          <b-tab title="文本自动翻译" active>
            <b-card-text>
              <b-alert variant="warning" style="text-align: left" show>
                注意：百度翻译API初次申请会有免费500W文字的翻译额度，申请链接:<span class="user-select-all">https://fanyi-api.baidu.com</span>
              </b-alert>
              <b-input-group size="sm" prepend="API Key" class="mb-2">
                <b-form-input v-model="baiduAppid" aria-label="Small text input with custom switch"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend="Secret Key" class="mb-2">
                <b-form-input v-model="baiduSecret" aria-label="Small text input with custom switch"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend="启用" class="mb-2">
                <b-input-group-append is-text>
                  <b-form-checkbox @change="clickBaiduTrans" v-model="enableBaiduTrans" switch class="mr-n2 mb-n1">
                  </b-form-checkbox>
                </b-input-group-append>
              </b-input-group>
              <b-input-group>
                <b-button @click="saveSetting('baiduCfg')" size="sm" variant="outline-info" fill>保存</b-button>
              </b-input-group>


            </b-card-text>
          </b-tab>
          <b-tab title="截屏配置">
            <b-card-text>
              <b-input-group size="sm" prepend="启用" class="mb-2">
                <b-input-group-append is-text>
                  <b-form-checkbox @change="clickEnableCapture" v-model="enableCapture" switch class="mr-n2 mb-n1">
                  </b-form-checkbox>
                </b-input-group-append>
              </b-input-group>

              <b-badge style="float: left; margin-right: 10px; font-size: 16px; font-weight: normal" variant="light">
                <span>快捷键</span>
              </b-badge>

              <b-form-radio-group
                  style="float: left"
                  v-model="captureKey"
                  :options="captureKeysOptions"
                  class="mb-3"
                  value-field="val"
                  text-field="name"
              ></b-form-radio-group>
              <b-input-group>
                <b-button @click="saveSetting('captureCfg')" size="sm" variant="outline-info" fill>保存</b-button>
              </b-input-group>
            </b-card-text>
          </b-tab>
          <b-tab title="系统信息">
            <b-card-text>
              <b-list-group style="text-align: left; font-weight: bold" flush>
                <b-list-group-item>缓存目录：{{ sysInfo.resource }}</b-list-group-item>
                <b-list-group-item>监听端口：{{ sysInfo.listenPort }}</b-list-group-item>
                <b-list-group-item>环境：{{ sysInfo.env }}</b-list-group-item>
                <b-list-group-item>项目地址：https://github.com/easyhutu/any-sync-gui</b-list-group-item>
                <b-list-group-item>Power By：
                  <b-badge variant="info">Vue2</b-badge>
                  &nbsp;
                  <b-badge variant="info">Electron</b-badge>
                </b-list-group-item>
              </b-list-group>

            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>

    </div>
  </div>

</template>
<script>
export default {
  name: 'settingPage',
  data() {
    return {
      settingUrl: `http://${window.location.hostname}:8081/setting`,
      baiduAppid: null,
      baiduSecret: null,
      enableBaiduTrans: false,
      enableCapture: false,
      captureKey: null,
      sysInfo: {},
      groupId: 1,
      dftCaptureKey: 'Alt + S',
      captureKeysOptions: [
        {
          val: 'Alt + S',
          name: 'ALT/⌥ + S',
        },
        {
          val: 'CommandOrControl + Shift + S',
          name: 'CTRL/⌘ + SHIFT + S',
        }
      ]
    }
  },
  mounted() {
    this.getSetting()
  },

  methods: {
    clickEnableCapture() {
      this.saveSetting('captureCfg')
    },
    getSetting() {
      this.$http.get(this.settingUrl).then((resp) => {
        console.log(resp.data)
        let baiduCfg = resp.data.baiduCfg
        let captureCfg = resp.data.captureCfg
        this.sysInfo = resp.data.sysInfo
        if (baiduCfg) {
          this.baiduAppid = baiduCfg.baiduAppid
          this.baiduSecret = baiduCfg.baiduSecret
          this.enableBaiduTrans = baiduCfg.enableBaiduTrans
        }
        if (captureCfg) {
          this.captureKey = captureCfg.captureKey ? captureCfg.captureKey : this.dftCaptureKey
          this.enableCapture = captureCfg.enableCapture
        } else {
          this.captureKey = this.dftCaptureKey
        }
      })
    },
    saveSetting(mode) {
      this.$http.post(this.settingUrl, {
        mode: mode,
        groupId: this.groupId,
        baiduCfg: {
          baiduAppid: this.baiduAppid,
          baiduSecret: this.baiduSecret,
          enableBaiduTrans: this.enableBaiduTrans
        },
        captureCfg: {
          enableCapture: this.enableCapture,
          captureKey: this.captureKey
        }


      }).then((resp) => {
        console.log(resp)
        let msg = '配置已保存'
        if (mode === 'captureCfg'){
          msg = '配置已保存，需重启应用生效'
        }
        this.$bvToast.toast(msg, {
          title: '提示',
          variant: 'info',
          solid: true,
          autoHideDelay: 3000,
        })
      })
    },
    clickBaiduTrans() {
      if (this.baiduAppid && this.baiduSecret) {
        this.saveSetting()
      } else {
        this.$bvToast.toast('启用翻译必须填写API Key、Secret Key', {
          title: '警告',
          variant: 'warning',
          solid: true,
          autoHideDelay: 3000,
        })
        this.enableBaiduTrans = false
      }
    }
  },
  watch: {}

}
</script>
<style>
.nav-link {
  background-color: aquamarine;
}
</style>