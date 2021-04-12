/****   request.js   ****/
/**axios封装 为了保证通用性 此文件建议不进行任何改动 */
// 导入axios
import axios from 'axios'
import qs from 'qs'
let _ = require('lodash');

//1. 创建新的axios实例，
const service = axios.create({
  // 公共接口
  baseURL: process.env.BASE_API,
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000,
  showLoading: true,//是否开启loading动画
});

/**请求时显示加载动画 函数声明(挂在service里面是为了跟着service一起被公布出去便于拓展) S*/
service.loadingTool = {};
service.loadingTool.needLoadingRequestCount = 0;
service.loadingTool.startLoading = function () {
  //故意不写逻辑
  //通过requestEx.js拓展重写此函数 开启loading动画函数
}
service.loadingTool.showFullScreenLoading = function () {
  if (service.loadingTool.needLoadingRequestCount === 0) {
    service.loadingTool.startLoading()
  }
  service.loadingTool.needLoadingRequestCount++
}

service.loadingTool.tryHideFullScreenLoading = function () {
  if (service.loadingTool.needLoadingRequestCount <= 0) return
  service.loadingTool.needLoadingRequestCount--

  if (service.loadingTool.needLoadingRequestCount === 0) {
    _.debounce(function () {
      if (typeof (service.loadingTool.tryCloseLoading) == 'function' && service.loadingTool.needLoadingRequestCount === 0) {
        service.loadingTool.tryCloseLoading();
      }
    }, 300)()//防止函数抖动，当有多个loading的时候避免间隔闪烁
  }
}
service.loadingTool.tryCloseLoading = function () {
  //故意不写逻辑
  //通过requestEx.js拓展重写此函数 关闭loading动画函数
}
/**请求时显示加载动画 E*/

/**额外拓展开始 S */
service.loadingTool.setRequestConfig = function(config){
  //自定义请求的config配置
  return config;
}

service.loadingTool.onloadSucceedEx = function(){
  //请求成功时 执行额外的检查 例如 登录检查 特殊判断 
 //带data参数(返回数据)

}
service.loadingTool.onloadErrorEx = function(errStr){
  //请求失败时时 执行额外的检查 例如 登录检查 特殊判断 
  alert(errStr);
}
/**额外拓展开始 E */

// 2.请求拦截器
service.interceptors.request.use(config => {
  if (config.showLoading) {//开启loading
    service.loadingTool.showFullScreenLoading()
  }
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
  config.headers = {
    Pragma: 'no-cache',//兼容ie(避免IE存在在当前页面没刷新的情况下再次请求接口直接拿缓存)
    'Content-Type': 'application/x-www-form-urlencoded',//配置请求头
    'Content-Security-Policy': "default-src 'self'; child-src http:" //csp头部设置
  }
  //注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
  const user = window.$ && window.$.getLoginUser() ? window.$.getLoginUser() : null;
  const token = user && user.Token ? user.Token : '';//这里取token之前，你肯定需要先拿到token,存一下
  if (token) {
    config.params = { 'token': token } //如果要求携带在参数中
    config.headers.token = token; //如果要求携带在请求头中
  }
  // 如果有登录用户信息，则统一设置 token
  if (config.method == 'post') {
    config.data.token = config.data.token && config.data.token.length > 0 ? config.data.token : token;
    //使用qs转换post请求的data
    config.data = qs.stringify(config.data);
  }
  else if (config.method == 'get') {
    config.params.token = config.params.token && config.params.token.length > 0 ? config.params.token : token;
  }

  if(typeof service.loadingTool.setRequestConfig=='function'){
    config = service.loadingTool.setRequestConfig(config);
  }
  
  return Promise.resolve(config)
}, error => {
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  // 对响应数据做点什么
  if (response.config.showLoading) {//关闭loading

    service.loadingTool.tryHideFullScreenLoading()
  }
  let data = response.data;
  if(typeof service.loadingTool.tryCloseLoading=='function'){
    service.loadingTool.onloadSucceedEx(data);
  }
  
  return data
}, error => {
  var errStr = '';
  /***** 接收到异常响应的处理开始 *****/
  if (error && error.response) {

    // 1.公共错误处理
    // 2.根据响应码具体处理
    errStr = error.message;
  } else {

    // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
      errStr = '服务器响应超时，请刷新当前页';

    }
    errStr = '连接服务器失败';

  }
  if(typeof service.loadingTool.onloadErrorEx=='function'){
    service.loadingTool.onloadErrorEx(errStr)
  }

  //   Message.error(error.message)
  /***** 处理结束 *****/
  //如果不需要错误处理，以上的处理过程都可省略
  return Promise.resolve(error.response)
})
//4.导入文件
export default service