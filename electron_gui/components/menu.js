const {BrowserWindow, shell, app} = require('electron')

function CreateMenuTemp(parentWin) {
    return [
        {
            label: "Application",
            submenu: [
                {
                    label: '重载UI',
                    click() {
                        parentWin.reload()
                    }
                },
                {
                    label: '设置',
                    click() {
                        var settingWin = new BrowserWindow({
                            width: 560,
                            height: 500,
                            title: '设置',
                            parent: parentWin,
                            autoHideMenuBar: true

                        })

                        // 加载 index.html
                        settingWin.loadURL('http://localhost:8081/#/setting')
                        settingWin.on('close', () => {
                            parentWin.reload()
                            parentWin.focus()
                            settingWin = null

                        })
                    }
                },

                {
                    label: '项目链接',
                    click() {
                        shell.openExternal('https://github.com/easyhutu/any-sync-gui')
                    }
                },
                {label: "关于", selector: "orderFrontStandardAboutPanel:"},
                {type: "separator"},
                {
                    label: "Quit", accelerator: "Command+Q", click: function () {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: "Edit",
            submenu: [
                {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
                {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
                {type: "separator"},
                {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
                {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
                {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
                {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
            ]
        }

    ]
}


module.exports = {
    CreateMenuTemp
}