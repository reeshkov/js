// ==UserScript==
// @name        Webcam CGI PTZ Control
// @version     0.3
// @grant       none
// @match       http://*/tmpfs/auto.jpg
// @namespace   https://github.com/reeshkov/js
// @updateURL   https://github.com/reeshkov/js/raw/master/webcam_cgi_ptz_control.user.js
// @downloadURL https://github.com/reeshkov/js/raw/master/webcam_cgi_ptz_control.user.js
// @category    Controls
// @description Add control buttons for CGI PTZ control commands from https://wiki.instar.com/1080p_Series_CGI_List/Complete_CGI_List/
// ==/UserScript==


var host = location.origin;
document.title = "WebCam at "+host;

window.onload = function() {};
document.body.onload = function() {
	var div = document.createElement('div'),
  mkButton = function(cmd, caption, callback){
    var y = document.createElement("INPUT");
    y.setAttribute("type", "button");
    y.setAttribute("value", caption);
    y.onclick=function(){
      var req = host+cmd;
      console.log("request "+req);
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function() {
          console.log("answer: "+this.responseText);
        	if('function'===typeof callback) callback(this.responseText);
          //alert(this.responseText);
        });
      oReq.open("GET", req);
      oReq.send();
    }
    return y;
  },
  refImg = function(data){
    var img = document.getElementsByTagName("img")[0],src;
    src = img.src.replace(/\?.*$/,'');
    console.log("IMG="+src);
    img.src = src+"?"+new Date();
  };
  
  //div.appendChild(mkButton("/param.cgi?cmd=getmotorattr","MOTOR",refImg));
  div.appendChild(mkButton("/param.cgi?cmd=getimageattr","REFRESH",refImg));
  div.appendChild(mkButton("/ptzup.cgi","UP",refImg));
  div.appendChild(mkButton("/ptzdown.cgi","DOWN",refImg));
  div.appendChild(mkButton("/ptzleft.cgi","LEFT",refImg));
  div.appendChild(mkButton("/ptzright.cgi","RIGHT",refImg));
  
  div.appendChild(mkButton("/param.cgi?cmd=preset&-act=goto&-number=2","PRESET 2",refImg));
  div.appendChild(mkButton("/param.cgi?cmd=preset&-act=goto&-number=3","PRESET 3",refImg));
  
  div.setAttribute("style", "position:absolute;");
  document.body.appendChild(div);
};
