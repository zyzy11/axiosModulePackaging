import  service from './request';
import { Loading } from 'element-ui'
import { MessageBox } from 'element-ui';
import AppConfig from '../../public/static/App_Resources/js/AppSelfConfig';

/**此js是拓展request.js 让 request.js尽可能少引用其他东西 尽可能的通用便于在多个项目中使用
 * 如项目中针对request有特定定制逻辑 
 * 必须在此js中拓展或重写request.js中的一些函数(检查错误方面不是很全面,需要自己重写函数时多注意!!!!!)
 * 总之此文件可以随意根据项目需求进行复写定制化axios的封装
 */

/**重写axios的一些函数 */
if(service.loadingTool){
  
  //重写自定义请求的config配置
  // service.loadingTool.setRequestConfig = function(config){
  //   config.headers = {
  //     Pragma: 'no-cache',//兼容ie(避免IE存在在当前页面没刷新的情况下再次请求接口直接拿缓存)
  //     'Content-Type': 'application/x-www-form-urlencoded',//配置请求头
  //     'Content-Security-Policy': "default-src 'self'; child-src http:" //csp头部设置
  //   }
  //   return config;
  // }

  //开启动画 重写loading动画 
  service.loadingTool.startLoading = function(){
    service.loadingTool.loading = Loading.service({
      lock: true,
      text: '加载中……',
      // background: 'rgba(0, 0, 0, 0.5)'//黑色背景
    })
  };
  //关闭动画 重写loading动画 
  service.loadingTool.tryCloseLoading = function(){
    if (service.loadingTool.loading) {
      service.loadingTool.loading.close()
    }
  }

  //重写请求成功后
service.loadingTool.onloadSucceedEx = function(data){
  //请求成功时 执行额外的检查 例如 登录检查 特殊判断 
  if (data.ErrorCode === -3 || data.Msg === "未登录或登录超时") {
    MessageBox.alert('登录超时!请重新登录', '提示信息', {
      type: 'error',
      dangerouslyUseHTMLString: true,
      callback: function () {
        
        //!!!!!!!!!!!!!跨站点所有这样写 其他项目用声明注释
        window.location.href = AppConfig.loginPageUrl.replace(
          "{{port}}",
          window.port
        );
      }
    });
  }else if(data.ErrorCode !== 0){
    MessageBox.alert(data.Message, {
      type: 'error',
      dangerouslyUseHTMLString: true,
    });
  }
}

//重写请求失败后
service.loadingTool.onloadErrorEx = function(errStr){
  //请求失败时时 执行额外的检查 例如 登录检查 特殊判断 
  MessageBox.alert(errStr, '提示信息', {
    type: 'error',
    dangerouslyUseHTMLString: true
  });
}

}

//4.导入文件
export default service;