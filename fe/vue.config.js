const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: './../electron_gui/dist',
  chainWebpack(config){
    config.plugin('html').tap(args => {
      args[0].title = 'Lan同步'
      return args
    })
  }
})
