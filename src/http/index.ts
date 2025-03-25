import axios, { type AxiosInstance } from "axios";
import { message } from 'antd';


// 根据对应 env 文件加载
const base_url = import.meta.env.VITE_BASE_URL;
// 请求超时时间（s）
const request_timeout = import.meta.env.VITE_REQUEST_TIMEOUT;
// 创建axios实例
const http: AxiosInstance = axios.create({
    baseURL: base_url, // api 的 base_url
    timeout: request_timeout * 1000, // 请求超时时间（ms）
    withCredentials: false, // 禁用 Cookie
    // headers: {
    //     "Content-Type": "application/json"
    // }
});


// 添加请求拦截器
http.interceptors.request.use(
    (request) => {
        // request.headers["MY-TOKEN"] = "Vincent"
        if (request.headers["Content-Type"] != "application/json") {
            request.headers["Content-Type"] = ""
        }
        return request
    },
    (error) => {
        console.error("网络错误，请稍后重试。")
        return Promise.reject(error);
    }
)

// 添加响应拦截器
http.interceptors.response.use(
    (response) => {
        return Promise.resolve(response.data);
    },
    (error) => {
        message.error('请求异常');
        return Promise.reject(error);
    }
)

export default http