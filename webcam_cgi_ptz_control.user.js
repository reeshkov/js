// ==UserScript==
// @name        Webcam CGI PTZ Control
// @version     0.4
// @grant       none
// @match       http://*/tmpfs/auto.jpg
// @namespace   https://github.com/reeshkov/js
// @updateURL   https://github.com/reeshkov/js/raw/master/webcam_cgi_ptz_control.user.js
// @downloadURL https://github.com/reeshkov/js/raw/master/webcam_cgi_ptz_control.user.js
// @category    Controls
// @description Add control buttons for CGI PTZ control commands from https://wiki.instar.com/1080p_Series_CGI_List/Complete_CGI_List/
// ==/UserScript==

(function() {
    'use strict';

var host = location.origin;
document.title = "WebCam at "+host;

	var div = document.createElement('div'),
  mkButton = function(cmd, caption, callback){
    var e = document.createElement("INPUT");
    e.setAttribute("type", "button");
    e.setAttribute("value", caption);
    e.onclick=function(){
      var req = host+cmd;
      console.log("request "+caption+" "+req);
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function() {
          console.log("answer: "+this.status);
          if('function'===typeof callback) callback(e,this);
      });
      oReq.open("GET", req);
      oReq.send();
    };
    return e;
  },
  refImg = function(){
    var img = document.getElementsByTagName("img")[0],src;
    src = img.src.replace(/\?.*$/,'');
    img.src = src+"?"+new Date();
    console.log("IMG="+img.src);
  };
  function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
  }
  //div.appendChild(mkButton("/param.cgi?cmd=getmotorattr","MOTOR",refImg));
  //var refBtn = mkButton("/tmpfs/auto.jpg","REFRESH",function(e,answ){
      //console.log("REFRESH: : "+answ.responseText);
  //    var src = "data:image/jpg;base64," + b64EncodeUnicode(answ.responseText)
  //    ,img = document.getElementsByTagName("img")[0];
  //    img.src = src;
  //})
  var refBtn = document.createElement("INPUT");
  refBtn.setAttribute("type", "button");
  refBtn.setAttribute("value", "REFRESH");
  refBtn.onclick=function(){
      if( refBtn.hasOwnProperty("refreshing") ){
          clearInterval(refBtn.refreshing);
          delete refBtn.refreshing;
          refBtn.setAttribute("value", "REFRESH");
      }else{
          refBtn.refreshing = setInterval(refImg,5000);
          refBtn.setAttribute("value", "REFRESHING");
      }
  }
  div.appendChild(refBtn);

  div.appendChild(mkButton("/ptzup.cgi","UP",refImg));
  div.appendChild(mkButton("/ptzdown.cgi","DOWN",refImg));
  div.appendChild(mkButton("/ptzleft.cgi","LEFT",refImg));
  div.appendChild(mkButton("/ptzright.cgi","RIGHT",refImg));
  
  div.appendChild(mkButton("/param.cgi?cmd=preset&-act=goto&-number=2","PRESET 2",refImg));
  div.appendChild(mkButton("/param.cgi?cmd=preset&-act=goto&-number=3","PRESET 3",refImg));
  
  div.setAttribute("style", "position:absolute;top: 0;");
  document.body.appendChild(div);


})();