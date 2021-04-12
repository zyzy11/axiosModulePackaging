import http from '../ResourceUtils/http'
// 
/**
 * 对请求像后端服务接口一样规范起来在统一文件夹统一位置进行接口服务的封装
 *  @parms resquest 当前api全局请求地址 解决多个站点服务访问问题  
 */
let resquest = "/sysWebService";//配置依据vue.config.js根据代理命名而来


const sysApi = {
    /**get请求 */
 getListAPI(params){
    return http.get(`${resquest}//Service/RoleRightMge.svrx/GetUserRights`,params)
},
/*各类型请求的例子 */
// post请求
 postFormAPI(params){
    return http.post(`${resquest}/postForm.json`,params)
},
// put 请求
 putSomeAPI(params){
    return http.put(`${resquest}/putSome.json`,params)
},
// delete 请求
 deleteListAPI(params){
    return http.delete(`${resquest}/deleteList.json`,params)
},

}

//导出
export default sysApi