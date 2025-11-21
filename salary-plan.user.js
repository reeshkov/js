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
    console.log("Days count loaded");

    function createMenu() {
        // 2. Create the menu container and links
        const menuContainer = document.createElement("div");
        const link1 = document.createElement("a");
        const link2 = document.createElement("a");

        link1.addEventListener('click',function(event){
            var element = event.target;
            event.stopPropagation();
            console.log(menuContainer);
        }, false);
        
        link2.addEventListener('click',function(event){
            var element = event.target;
            event.stopPropagation();
            console.log(menuContainer);
        }, false);

        link1.href = "#link1";
        link1.textContent = "JS Link 1";
        link2.href = "#link2";
        link2.textContent = "JS Link 2";

        menuContainer.appendChild(link1);
        menuContainer.appendChild(link2);

        // 3. Apply necessary CSS styles inline using JavaScript
        menuContainer.style.display = "none"; // Initially hidden
        menuContainer.style.position = "absolute";
        menuContainer.style.backgroundColor = "#f9f9f9";
        menuContainer.style.minWidth = "160px";
        menuContainer.style.boxShadow = "0px 8px 16px 0px rgba(0,0,0,0.2)";
        menuContainer.style.zIndex = "10";
        menuContainer.style.padding = "10px";

        // Style the links (optional)
        link1.style.display = "block";
        link2.style.display = "block";
        link1.style.padding = "5px 0";
        link2.style.padding = "5px 0";
        link1.style.color = "black";
        link2.style.color = "black";
        link1.style.textDecoration = "none";
        link2.style.textDecoration = "none";


        // 4. Append the menu to the body or a specific container
        document.body.appendChild(menuContainer);

        // 6. Add a listener to the window to close the menu when clicking elsewhere
        window.addEventListener("click", function(event) {
            if (event.target !== targetElement && !menuContainer.contains(event.target)) {
                menuContainer.style.display = "none";
            }
        });
        return menuContainer;
    }

    const menuContainer = createMenu();
    window.addEventListener('click',function(event){
        var element = event.target;
        event.stopPropagation();
        if(element.tagName.toUpperCase() === "TD"){
            console.log("click",element);
            // Toggle visibility
            if (menuContainer.style.display === "none") {
                // Position the menu relative to the button
                const rect = element.getBoundingClientRect();
                menuContainer.style.top = `${rect.bottom + window.scrollY}px`;
                menuContainer.style.left = `${rect.left + window.scrollX}px`;
                menuContainer.style.display = "block";
                menuContainer.salaryProperty = {
                    "test":"tYes"
                };
            } else {
                menuContainer.style.display = "none";
            }
        }
    }, false);


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
