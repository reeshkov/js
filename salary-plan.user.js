// ==UserScript==
// @name         salary plan at consultant.ru
// @version      0.1
// @description  salary plan
// @author       Reeshkov
// @match        https://www.consultant.ru/law/ref/calendar/proizvodstvennye/*
// @namespace   https://github.com/reeshkov/js
// @updateURL   https://github.com/reeshkov/js/raw/master/salary-plan.user.js
// @downloadURL https://github.com/reeshkov/js/raw/master/salary-plan.user.js
// @category    Webtools
// @grant      none
// ==/UserScript==

(function() {
    'use strict';
    console.log("Days count laded");
    const months = document.evaluate(
        "//table[@class='cal']",
        document,
        null,
        XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null,
    );

    try {
        let thisNode = months.iterateNext();

        while (thisNode) {
            let month = thisNode.querySelector(".month");
            let days = thisNode.querySelectorAll("tbody td:not(.inactively)");
            console.log(month.textContent,days);
            thisNode = months.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
})();
