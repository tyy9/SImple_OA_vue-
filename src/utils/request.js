import axios from 'axios'
import { Message, MessageBox } from 'element-ui'  //导入element-ui组件库
 
// 创建axios的对象
const instance = axios.create({
    baseURL: "http://localhost:8001/",  //配置固定域名
    timeout: 5000
})
 
// 请求拦截
// 所有的网络请求都会走这个方法,可以在请求添加自定义内容
instance.interceptors.request.use(
    function (config) {
        config.headers.token = '123456' // 请求头添加token值
        config.headers.info = 'lxy'  //请求头添加info值
        return config
    },
    function (err) {
        return Promise.request(err)
    }
)
 
// 响应拦截
// 此处可以根据服务器返回的状态码做相应的数据
instance.interceptors.response.use(
    function (response) {
        const res = response.data
        console.log(res)
        if (res.status === 500) {
            MessageBox.alert('系统未登录，请重新登录', '错误', {
                confirmButtonText: '确定',
                type: 'error'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload()
                })
            })
            return Promise.reject('error')
        } else if (res.errno === 502) {
            MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
                confirmButtonText: '确定',
                type: 'error'
            })
            return Promise.reject('error')
        }
        return res
    },
    function (err) {
        return Promise.request(err)
    }
)
 
// 封装get和post请求
export function get(url, params) {
    return instance.get(url, {params})
}
 
export function post(url, data) {
    return instance.post(url, data)
}
 
export default instance;