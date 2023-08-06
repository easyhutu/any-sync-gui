### any-sync-gui

> 局域网同步工具
> 
![](doc/pc.png)
![](doc/phone.png)

### DEV
依赖： nodejs v16.19.0

> fe

gui依赖fe打包的前端页面，需要先打包fe才可以调试electron

```shell
cd fe

npm install

# 调试
nmp run serve

# 打包
npm run build
```

> electron_gui初始化

```shell
cd electron_gui

npm install

# 调试
npm run start

# 打包应用，一个平台只能打包对应平台的应用
npm run make
```