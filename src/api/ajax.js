// 二次封装axios
import axios from "axios";
//导入进度条
import nprogress from "nprogress";
//导入进度的样式
import "nprogress/nprogress.css";
//利用axios的create方法来创建axios实例
const request = axios.create({
  //基础路径也就是，相同的路径
  baseURL: "/api",
  //限定请求时间
  timeout: 4000,
});
//请求拦截器，在请求发出去之前可以拦截，在请求出去之前可以做一些事情
request.interceptors.request.use((config) => {
  //config,是一个配置对象，里面有个重要的属性，headers请求头
  //进度条开始
  let token = localStorage.getItem("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  nprogress.start();
  return config;
});
//响应拦截器，也就是请求回来之前可以拦截，在请求回来之前可以做一些事情
request.interceptors.response.use(
  (res) => {
    //成功的回调
    //进度条结束
    nprogress.done();
    return res.data;
  },
  (err) => {
    nprogress.done();
    //失败的回调
    return err.response.data;
  }
);

export default request;
