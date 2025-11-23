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
// @run-at      document-idle
// ==/UserScript==



(function() {
    'use strict';
    console.log("Days count loaded");
    const salaryArgs = ["Рабочий","Отпуск","Больничный"];

    function createMenu() {
        const menuContainer = document.createElement("div");

        salaryArgs.forEach((arg, i) => {
            let item = document.createElement("div");
            item.textContent = arg;
            item.addEventListener('click',function(event){
                var element = event.target;
                event.stopPropagation();
                console.log(i, menuContainer.clickedElement, element);
            }, false);
            item.addEventListener("mouseover", function( event ) {
                var element = event.target;
                element.style.cursor = "pointer";
            }, false);
            menuContainer.appendChild(item);
            console.log("menu", arg, i, item);
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
        numberInput.min = "1000"; // Set minimum value
        numberInput.value = "1000"; // Set default value

        const inputBox = document.createElement("div");
        inputBox.appendChild(newLabel);
        inputBox.appendChild(numberInput);
        infoContainer.appendChild(inputBox);
        document.body.appendChild(infoContainer);
        return infoContainer;
    }

    let infoContainer = createInfo();

    const months = document.evaluate(
        "//table[@class='cal']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
    );
    for (let i = 0; i < months.snapshotLength; i++) {
        let month = months.snapshotItem(i).querySelector(".month");
        const monthBox = document.createElement("pre");
        monthBox.style.border = "1px solid #333";
        let days = months.snapshotItem(i).querySelectorAll("tbody td:not(.inactively)");
        let workDays = months.snapshotItem(i).querySelectorAll('tbody td[class=""]');
        monthBox.textContent = month.textContent+" wdays:"+workDays.length;
        infoContainer.appendChild(monthBox);
        days.forEach((dayElement, i) => {
            dayElement.addEventListener("mouseover", function( event ) {
                var element = event.target;
                element.style.cursor = "copy";
            }, false);
            dayElement.addEventListener('click',function(event){
                var element = event.target;
                event.stopPropagation();
                // Toggle visibility
                if (menuContainer.style.display === "none") {
                    // Position the menu relative to the button
                    const rect = element.getBoundingClientRect();
                    menuContainer.style.top = `${rect.bottom + window.scrollY}px`;
                    menuContainer.style.left = `${rect.left + window.scrollX}px`;
                    menuContainer.style.display = "block";
                    menuContainer.clickedElement = element;
                } else {
                    menuContainer.style.display = "none";
                    menuContainer.clickedElement = null;
                }
            }, false);
            console.log(i, month.textContent, dayElement.textContent, dayElement.className);
        });
    }
})();
