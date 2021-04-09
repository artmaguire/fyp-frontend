import './js/map.js';
import '@fontsource/lato';

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { io } from "socket.io-client";
import MainComponent from './components/MainComponent';
import store from './store';
import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';


Vue.config.productionTip = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);


// Websocket to communicate with Flask, for searching geonames
const socket = io();
Vue.use(VueSocketIOExt, socket);

new Vue({
  store: store,
  render: h => h(MainComponent),
}).$mount('#main-component');
