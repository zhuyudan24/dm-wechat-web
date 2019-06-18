import 'babel-polyfill';
import 'amfe-flexible';
import Vue from 'vue';
import App from './App';
import store from './store/index'
import {  router } from './router';
import './assets/font/iconfont.css';
import './assets/css/common.css';
import Es6Promise from 'es6-promise';
require('es6-promise').polyfill();
Es6Promise.polyfill();
/* eslint-disable */
// import VConsole from 'vconsole';
// let vConsole = new VConsole();

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
