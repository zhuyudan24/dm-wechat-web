import axios from 'axios';
import store from '../store/index';
import qs from 'qs';
import { Toast } from 'vant';

let local = '';
if (process.env.NODE_ENV === 'development') {
  local = '//www.gicdev.com';
}else {
  local = window.location.origin;
}
let loading = '';

// 创建axios 实例
const service = axios.create({
  baseURL: local, // api的base_url
  timeout: 20000, // 请求超时时间
  withCredentials: true,
})

// request 拦截器
service.interceptors.request.use(
  config => {
    loading = Toast.loading({
      duration: 0, // 持续展示 toast
      mask: true,
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: ' '
    });
    // loading true
    store.dispatch('SetLoading', true);
    return config;
  },
  error => {
    loading.clear();
    // loading false
    setTimeout(function() {
      store.dispatch('SetLoading', false);
    }, 300)
    Promise.reject(error);
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    loading.clear();
    // loading false
    store.dispatch('SetLoading', false);
    return res;
  },
  error => {
    loading.clear();
    // loading false
    store.dispatch('SetLoading', false);
    return Promise.reject(error);
  }
)

// export default service
/*
 *
 * 统一响应处理
 * @url:
 *
 */
function handleResponse(code, msg) {
  switch (code) {
    case 1:
      // Toast(msg);
      break;
  }
}

/*
 *
 * 统一 get 请求方法
 * @url: 请求的 url
 * @params: 请求带的参数
 * @header: 带 token
 *
 */

export const getRequest = (url, params) => {
  params.requestProject = "web";
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url: `${local}${url}`,
      data: {},
      params: params,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },// "token": token
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

/*
 *
 * 统一 post 请求方法
 * url: 请求的 url
 * @params: 请求带的参数
 * @header:
 *
 */

export const postRequest = (url, params) => {
  params.requestProject = "web";
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: `${local}${url}`,
      data: qs.stringify(params),
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const postJsonRequest = (url, params) => {
  params.requestProject = "web";
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: `${local}${url}`,
      data: "{}",
      params: params,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}

/*
 * method: 'post'
 * 'Content-Type': 'application/json;charset=UTF-8'
 * @data: params
 * @requestProject: 'web'
 *
 */

export const postJson = (url, params) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: `${local}${url}`,
      data: params,
      params: { requestProject: 'web' },
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    }).then(res => {
      if (res.errorCode != 0) {
        handleResponse(res.errorCode, res.message);
        reject(res);
      } else {
        resolve(res);
      }
    }).catch(error => {
      reject(error);
    })
  })
}

/*
 * method: 'post'
 * @data: params
 *
 */
export const postForm = (url, params) => {
  params.requestProject = "web";
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: `${local}${url}`,
      data: params,
      headers: {}
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
