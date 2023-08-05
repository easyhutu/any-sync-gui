const {BrowserWindow, shell} = require('electron')
const path = require("path");

function CreateMenuTemp(parentWin) {
    return [
        {
            label: '选项',
            submenu:[
                {
                    label: '设置',
                    click(){
                        var settingWin = new BrowserWindow({
                            width: 560,
                            height: 500,
                            title: '设置',
                            parent: parentWin,
                            autoHideMenuBar: true

                        })

                        // 加载 index.html
                        settingWin.loadURL('http://localhost:8081/#/setting')
                        settingWin.on('close', ()=>{
                            parentWin.reload()
                            parentWin.focus()
                            settingWin = null

                        })
                    }
                },
                {
                    label: '关于',
                    click(){
                        shell.openExternal('https://github.com/easyhutu/any-sync-gui')
                    }
                }
            ]
        },

    ]
}


module.exports = {
    CreateMenuTemp
}