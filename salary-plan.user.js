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
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-idle
// ==/UserScript==



(function() {
    'use strict';
    let debugReset = false;
    console.log("Days count loaded", debugReset);
    const year =  /(?<=proizvodstvennye\/)\d+/.exec(window.location.pathname)[0];
    let userData = GM_getValue(year);
    let userDataChanged = false;
    if (!userData) {
        userData = [];
        userDataChanged = true;
    } else {
        userData = JSON.parse(userData);
        // console.log("userData", JSON.stringify(userData));
    }
    let saveUserData = () => {
        var data = JSON.stringify(userData)
        GM_setValue(year, data);
        userDataChanged = false;
    };
    const salaryArgs = ["Рабочий","Отпуск","Больничный"];
    const salaryArgsIndex = (() => {let o = {}; salaryArgs.forEach((k, i) => o[k] = i); return o;})()
    const salaryArgsColors = ["white","green","yellow"];


    function createMenu() {
        const menuContainer = document.createElement("div");

        salaryArgs.forEach((arg, i) => {
            let item = document.createElement("div");
            item.textContent = arg;
            item.addEventListener('click',function(event){
                var element = event.target;
                event.stopPropagation();
                var dayElement = document.querySelector('[element-clicked-id="'+menuContainer.dataset.clickedElementId+'"]');
                var elementDayType = parseInt(dayElement.getAttribute("element-day-type")),
                elementDayTypeNew = salaryArgsIndex[element.textContent],
                m = dayElement.getAttribute("element-month-id"),
                d = dayElement.getAttribute("element-day-id");
                if (elementDayType != elementDayTypeNew) {
                    userData[m][d] = elementDayTypeNew;
                    userDataChanged = true;
                    dayElement.setAttribute("element-day-type", elementDayTypeNew);
                    console.log(dayElement);
                }
                if (userDataChanged) {
                    console.log(i, element.textContent, typeof elementDayType, elementDayType, elementDayType!=elementDayTypeNew, elementDayTypeNew, typeof elementDayTypeNew);
                    saveUserData();
                    menuContainer.style.display = "none";
                }
            }, false);
            item.addEventListener("mouseover", function( event ) {
                var element = event.target;
                element.style.cursor = "pointer";
            }, false);
            menuContainer.appendChild(item);
            // console.log("menu", arg, i, item);
        });

        // 3. Apply necessary CSS styles inline using JavaScript
        menuContainer.style.display = "none"; // Initially hidden
        menuContainer.style.position = "absolute";
        menuContainer.style.backgroundColor = "#f9f9f9";
        menuContainer.style.minWidth = "160px";
        menuContainer.style.boxShadow = "0px 8px 16px 0px rgba(0,0,0,0.2)";
        menuContainer.style.zIndex = "10";
        menuContainer.style.padding = "10px";

        document.body.appendChild(menuContainer);

        // 6. Add a listener to the window to close the menu when clicking elsewhere
        window.addEventListener("click", function(event) {
            if (!menuContainer.contains(event.target) ) {
                menuContainer.style.display = "none";
            }
        });
        return menuContainer;
    }
    const menuContainer = createMenu();

    function createInfo() {
        const infoContainer = document.createElement("div");
        infoContainer.style.position = "fixed";
        infoContainer.style.top = "10px";        // 10 pixels from the top edge
        infoContainer.style.right = "1px";       // 10 pixels from the left edge
        infoContainer.style.backgroundColor = "#fff";
        infoContainer.style.padding = "1px";
        infoContainer.style.border = "1px solid #333";
        infoContainer.style.zIndex = "1000";

        const newLabel = document.createElement("label");
        newLabel.textContent = "Оклад: ";
        newLabel.setAttribute("for", "salary");

        const numberInput = document.createElement("input");
        numberInput.setAttribute("type", "number"); // Set the type to number
        numberInput.id = "salary";
        numberInput.name = "salary";
        numberInput.min = "310"; // Set minimum value
        numberInput.value = "310"; // Set default value

        const inputBox = document.createElement("div");
        inputBox.appendChild(newLabel);
        inputBox.appendChild(numberInput);
        infoContainer.appendChild(inputBox);
        document.body.appendChild(infoContainer);
        return infoContainer;
    }

    let infoContainer = createInfo();

    const observer = new MutationObserver(callback);
    function callback(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                console.log(mutation.attributeName, mutation.target);
                if ("element-day-type" === mutation.attributeName) {
                    let dayElement = mutation.target;
                    dayElement.style.backgroundColor = salaryArgsColors[dayElement.getAttribute("element-day-type")];
                }
            }
        }
    }
    const observer_config = {
        attributes: true,
        attributeOldValue: true
    };

    const months = document.evaluate(
        "//table[@class='cal']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
    );
    for (let m = 0; m < months.snapshotLength; m++) {
        let month = months.snapshotItem(m).querySelector(".month");
        const monthBox = document.createElement("pre");
        monthBox.style.border = "1px solid #333";
        let days = months.snapshotItem(m).querySelectorAll("tbody td:not(.inactively)");
        let workDays = months.snapshotItem(m).querySelectorAll('tbody td[class=""]');
        monthBox.textContent = month.textContent+" wDays:"+workDays.length+" dCost:"+Math.ceil(infoContainer.querySelector("input").value / workDays.length);
        infoContainer.appendChild(monthBox);
        days.forEach((dayElement, d) => {
            dayElement.style.cursor = "copy";
            if (!userData[m] || debugReset) {
                userData[m] = [];
                userDataChanged = true;
            }
            if (!userData[m][d]) {
                userData[m][d] = salaryArgsIndex["Рабочий"];
                userDataChanged = true;
            }
            var clickedElementId ="m"+m+"d"+d, 
                dayType = userData[m][d];
            dayElement.setAttribute("element-clicked-id", clickedElementId);
            dayElement.setAttribute("element-day-type", dayType);
            dayElement.setAttribute("element-month-id", m);
            dayElement.setAttribute("element-day-id", d);
            dayElement.style.backgroundColor = salaryArgsColors[dayType];
            dayElement.addEventListener('click',function(event){
                event.stopPropagation();
                var dayElement = event.target;
                // Toggle visibility
                if (menuContainer.style.display === "none") {
                    // Position the menu relative to the button
                    const rect = dayElement.getBoundingClientRect();
                    menuContainer.style.top = `${rect.bottom + window.scrollY}px`;
                    menuContainer.style.left = `${rect.left + window.scrollX}px`;
                    menuContainer.style.display = "block";
                    menuContainer.dataset.clickedElementId = clickedElementId;
                } else {
                    menuContainer.style.display = "none";
                    menuContainer.dataset.clickedElement = null;
                }
            }, false);
            observer.observe(dayElement, observer_config);
        });
    }
    if (userDataChanged) {
        saveUserData();
    }
})();
