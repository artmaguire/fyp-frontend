import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from "socket.io-client"

import store from './store'

import MainComponent from './components/MainComponent';

import '@fontsource/lato';

import './js/map.js';


Vue.config.productionTip = false

// Websocket to communicate with Flask, for searching geonames
const socket = io();
Vue.use(VueSocketIOExt, socket);

new Vue({
  store: store,
  render: h => h(MainComponent),
}).$mount('#main-component');
