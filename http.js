/****   http.js   ****/
// 导入封装好的axios实例
import request from './requestEx';

const http ={
    /**
     * methods: 请求
     * @param url 请求地址 
     * @param params 请求参数
     */
    get(url,params,showLoading){
        const config = {
            method: 'get',
            url:url,
        }
        if(typeof showLoading!='undefined') config.showLoading =showLoading; 
        if(params) config.params = params
        return request(config)
    },
    post(url,params,showLoading){
        const config = {
            method: 'post',
            url:url,
        }
        if(typeof showLoading!='undefined') config.showLoading =showLoading; 
        if(params) config.data = params
        return request(config)
    },
    put(url,params){
        const config = {
            method: 'put',
            url:url
        }
        if(params) config.params = params
        return request(config)
    },
    delete(url,params){
        const config = {
            method: 'delete',
            url:url
        }
        if(params) config.params = params
        return request(config)
    }
}
//导出
export default http
