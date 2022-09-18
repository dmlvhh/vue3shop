
module.exports = {
  configureWebpack:{
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'network': '@/network',
        'utils': '@/utils',
        'views': '@/views',
      }
    }
  },
  devServer:{
    open: true,  //项目运行后是否自动打开
    proxy: {
      "/api": {
        target: "https://api.shop.eduwork.cn",
        // target: "https://ebfb-42-232-10-73.ngrok.io",
        // // 设置网络跨域
        ws: false,   //webstock
        changeOrigin:true,
        // 是否使用https接口
        secure:true,
        pathRewrite: {
          "^/api" : "",
        }
      }
    }
  }
}