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
                                注意：百度翻译API初次申请会有免费500W文字的翻译额度，申请链接:<span
                                    class="user-select-all">https://fanyi-api.baidu.com</span>
                            </b-alert>
                            <b-form-group label-align="left" label-cols="3" label-cols-lg="3" label="API Key"
                                          label-for="input-default">
                                <b-form-input v-model="baiduAppid"
                                              aria-label="Small text input with custom switch"></b-form-input>
                            </b-form-group>

                            <b-form-group label-align="left" label-cols="3" label-cols-lg="3" label="Secret Key"
                                          label-for="input-default">
                                <b-form-input v-model="baiduSecret"
                                              aria-label="Small text input with custom switch"></b-form-input>
                            </b-form-group>

                            <b-form-group label-align="left" label-cols="3" label-cols-lg="3" label="启用"
                                          label-for="input-default">
                                <b-form-checkbox style="float: left; margin-top: 5px" @change="clickBaiduTrans"
                                                 v-model="enableBaiduTrans" switch class="mr-n2 mb-n1">
                                </b-form-checkbox>
                            </b-form-group>

                            <b-input-group>
                                <b-button @click="saveSetting(modes.baiduCfg)" size="sm" variant="outline-info" fill>保存
                                </b-button>
                            </b-input-group>


                        </b-card-text>
                    </b-tab>
                    <b-tab title="截屏配置">
                        <b-card-text>
                            <b-form-group label-align="left" label-cols="2" label-cols-lg="3" label="启用"
                                          label-for="input-default">
                                <b-form-checkbox style="float: left;margin-top: 5px" @change="clickEnableCapture"
                                                 v-model="enableCapture" switch class="mr-n2 mb-n1">
                                </b-form-checkbox>
                            </b-form-group>

                            <b-form-group label-align="left" label-cols="2" label-cols-lg="3" label="快捷键"
                                          label-for="input-default">
                                <b-form-radio-group
                                        style="float: left"
                                        v-model="captureKey"
                                        class="mb-3"
                                >
                                    <b-form-radio style="font-weight: normal; margin-top: 5px"
                                                  :value="captureKeysOptions[0].val">
                                        ALT /
                                        <b-icon icon="option"></b-icon>
                                        + S
                                    </b-form-radio>
                                    <b-form-radio style="font-weight: normal; margin-top: 5px"
                                                  :value="captureKeysOptions[1].val">
                                        CTRL /
                                        <b-icon icon="command"></b-icon>
                                        + SHIFT + S
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>

                            <b-input-group>
                                <b-button @click="saveSetting(modes.captureCfg)" size="sm" variant="outline-info" fill>
                                    保存
                                </b-button>
                            </b-input-group>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="其他设置">
                        <b-card-text>

                            <b-form-group label-align="left" label-cols="4" label-cols-lg="5" label="自动打开文件夹"
                                          label-for="input-default">
                                <b-form-checkbox style="float: left;margin-top: 5px" @change="clickEnableAutoOpenFolder"
                                                 v-model="enableAutoOpenFolder" switch class="mr-n2 mb-n1">
                                    <b-icon id="tooltip-cfg-1" variant="info" icon="question-circle"></b-icon>
                                    <b-tooltip target="tooltip-cfg-1" triggers="hover">
                                        当下载完成后自动打开下载文件夹
                                    </b-tooltip>
                                </b-form-checkbox>
                            </b-form-group>

                            <b-form-group label-align="left" label-cols="4" label-cols-lg="5" label="缓存"
                                          label-for="input-default">
                                <b-button style="float: left" class="mr-n2 mb-n1" pill
                                          @click="saveSetting(modes.clearSync)" size="sm" variant="warning">
                                    清除缓存数据
                                </b-button>
                            </b-form-group>


                        </b-card-text>
                    </b-tab>
                    <b-tab title="系统信息">
                        <b-card-text>
                            <b-list-group style="text-align: left; font-weight: bold" flush>
                                <b-list-group-item>缓存目录：{{ sysInfo.resource }}
                                    <b-badge pill variant="info">已用{{ resourceSize }}</b-badge>
                                </b-list-group-item>
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
            modes: {
                clearSync: 'clearSync',
                captureCfg: 'captureCfg',
                baiduCfg: 'baiduCfg',
            },
            settingUrl: `http://${window.location.hostname}:8081/setting`,
            baiduAppid: null,
            baiduSecret: null,
            enableBaiduTrans: false,
            enableCapture: false,
            enableAutoOpenFolder: false,
            captureKey: null,
            sysInfo: {},
            resourceSize: 0,
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
        clickEnableAutoOpenFolder() {
            this.saveSetting('electronCfg')
        },
        getSetting() {
            this.$http.get(this.settingUrl).then((resp) => {
                console.log(resp.data)
                let baiduCfg = resp.data.baiduCfg
                let captureCfg = resp.data.captureCfg
                let electronCfg = resp.data.electronCfg
                this.sysInfo = resp.data.sysInfo
                this.resourceSize = resp.data.resourceSize
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
                if (electronCfg) {
                    this.enableAutoOpenFolder = electronCfg.enableAutoOpenFolder
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
                },
                electronCfg: {
                    enableAutoOpenFolder: this.enableAutoOpenFolder
                }


            }).then((resp) => {
                console.log(resp)
                let msg = '配置已保存'
                if (mode === this.modes.captureCfg) {
                    msg = '配置已保存，需重启应用生效'
                }
                if (mode === this.modes.clearSync) {
                    msg = '所有设备同步数据已清除'
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
                this.saveSetting(this.modes.baiduCfg)
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