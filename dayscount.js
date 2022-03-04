// ==UserScript==
// @name         Days count calendar at consultant.ru
// @version      0.2
// @description  days count
// @author       Reeshkov
// @match        http*://www.consultant.ru/law/ref/calendar/proizvodstvennye/*
// @namespace   https://github.com/reeshkov/js
// @updateURL   https://github.com/reeshkov/js/raw/master/dayscount.js
// @downloadURL https://github.com/reeshkov/js/raw/master/dayscount.js
// @category    Webtools
// @grant      none
// ==/UserScript==

(function() {
    'use strict';
    console.log("Days count laded");
    var countNode = document.createTextNode("0");
    var div = document.createElement('div');
    div.appendChild(countNode);
    div.setAttribute("style", "position:fixed;top:0;right:0;background-color:lightgreen;border-style:solid;border-color:green;font-size:20px;");
    document.body.appendChild(div);

    window.addEventListener('click',function(event){
//         var x = event.clientX, y = event.clientY,
//             element = document.elementFromPoint(x, y);
        var element = event.target; 
        if(element.tagName.toUpperCase() === "TD"){
            if(!element.style.backgroundColor){
                element.style.backgroundColor = "green";
                element.style.cursor = "no-drop";
                countNode.textContent = parseInt(countNode.textContent, 10) + 1;
            }else{
                element.style.backgroundColor = "";
                element.style.cursor = "copy";
                countNode.textContent = parseInt(countNode.textContent, 10) - 1;
            }
        }
    }, false);
    window.addEventListener("mouseover", function( event ) {
        var element = event.target;
        if(event.target.tagName.toUpperCase() === "TD"){
            if(!element.style.backgroundColor){
                element.style.cursor = "copy";
            }else{
                element.style.cursor = "no-drop";
            }
        }else{
            element.style.cursor = "auto";
        }
    }, false);
})();
