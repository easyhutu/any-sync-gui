// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const {app, BrowserWindow, Menu, ipcMain, Tray} = require('electron')
const {CreateMenuTemp, CreateTrayMenuTemp} = require('./components')
const path = require('path')
const {appSrv, MasterId, syncWsM} = require('./server')
const {getWithFile} = require('./server/utils')
const cutWindow = require('./components/capture/main/capture')

appSrv.listen(8081) // 启动服务
let captureCfg = getWithFile('captureCfg')


var win = null;
let willQuitApp = false

function initTray() {
    let imgPath = './public/icons.iconset/icon_16x16.png'
    let trayImgPath = process.env.NODE_ENV === 'debug' ? path.join(__dirname, imgPath) : path.join(process.resourcesPath, imgPath)
    const appTray = new Tray(trayImgPath)
    appTray.setTitle('Lan同步')
    appTray.setContextMenu(Menu.buildFromTemplate(CreateTrayMenuTemp(app, win)))
    appTray.on('double-click', function () {
        win.show()

    })

}

const createWindow = () => {

    // run capture

    // 创建浏览窗口
    win = new BrowserWindow({
        width: 860,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })


    Menu.setApplicationMenu(Menu.buildFromTemplate(CreateMenuTemp(app, win)))
    // 加载 index.html
    win.loadURL(`http://localhost:8081?masterId=${MasterId}`)
    // 打开开发工具
    // mainWindow.webContents.openDevTools()

    win.on('close', event => {
        console.log('win close')
        if (willQuitApp) {
            app.quit()
            return
        }
        event.preventDefault()
        win.hide()
    })
    initTray()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()

    cutWindow(win, captureCfg)
    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        win.show()
    })
    ipcMain.on('master-screen-capture', (event, url) => {
        console.log('screen capture', url.length)
        syncWsM.sendMasterDevMsg('capture', url)
    })
})

// 在应用程序开始关闭窗口之前触发
app.on('before-quit', () => {
    console.log('before quit...')
    willQuitApp = true;
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出ß
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。