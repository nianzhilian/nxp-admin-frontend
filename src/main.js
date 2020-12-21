// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/base.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/css/nxp.css'

import './permission' // 权限

Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.use(iView);

import plugin from './plugin'
Vue.use(plugin)

/*process.env.MOCK && require('./mock/index.js')*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})

;
(function() {
  window.userClient = window.userClient || {};
  var sUserAgent = navigator.userAgent;
  var isWin = (navigator.platform == "Win32") || (navigator.platform ==
    "Windows");
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform ==
    "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform ==
    "MacIntel");
  if (isMac) userClient.userOs = "MacOS";
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) userClient.userOs = "Unix"
  var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  if (isLinux) userClient.userOs = "Linux"
  if (isWin) userClient.userOs = "Windows"
  userClient.userBrowser = sUserAgent;


  //get the IP addresses associated with an account
  function getIPs(callback) {
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking
    if (!RTCPeerConnection) {
      var iframe = document.createElement('iframe');
      //invalidate content script
      iframe.sandbox = 'allow-same-origin';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      var win = iframe.contentWindow;
      window.RTCPeerConnection = win.RTCPeerConnection;
      window.mozRTCPeerConnection = win.mozRTCPeerConnection;
      window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
      RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
      optional: [{
        RtpDataChannels: true
      }]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if (window.webkitRTCPeerConnection)
      servers = {
        iceServers: [{
          urls: "stun:stun.services.mozilla.com"
        }]
      };

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    //listen for candidate events
    pc.onicecandidate = function(ice) {

      //skip non-candidate events
      if (ice.candidate) {

        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;

        var ip_arr = [];
        if (ip_regex.exec(ice.candidate.candidate)) {
          ip_arr = ip_regex.exec(ice.candidate.candidate);
        }
        var ip_addr = ip_arr[1];
        //remove duplicates
        if (ip_dups[ip_addr] === undefined)
          callback(ip_addr);

        ip_dups[ip_addr] = true;
      }
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result) {

      //trigger the stun server request
      pc.setLocalDescription(result, function() {}, function() {});

    }, function() {});
  }

  //Test: Print the IP addresses into the console
  getIPs(function(ip) {
    if (ip) {
      userClient.internalIp = ip;
    }
  });
})()
