/* global Waze */
// ==UserScript==
// @name         WME Validator Behavinator
// @namespace    https://greasyfork.org/en/users/30893-kevin-buley
// @description  Force Validator to live in a tab like everyone else
// @author       Kevin Buley
// @include      https://www.waze.com/*editor/*
// @include      https://editor-beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @version      0.06
// @grant        none
// @copyright    2016 Kevin Buley
// ==/UserScript==

(function() {
    'use strict';
    function debugLog(message) {
        window.console.log("WME-ValidatorBehavinator:" + message);
        return;
    }
    function getElementsByClassName(classname, node) {
        if (!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }
    function getId(node) {
        return document.getElementById(node);
    }


    function awaitLogin(e) {
        if (e && e.user === null) {
            return;
        }

        if (typeof Waze === 'undefined' || typeof Waze.loginManager === 'undefined') {
            setTimeout(awaitLogin, 100);
            return;
        }

        if (!Waze.loginManager.hasUser()) {
            Waze.loginManager.events.register("login", null, awaitLogin);
            Waze.loginManager.events.register("loginStatus", null, awaitLogin);
            return;
        }

        if (getId('WazeMap') === null) {
            setTimeout(awaitLogin, 100);
            return;
        }

        var Validator = $('a[href*="t=76488"]:first')[0];
        if (typeof Validator === 'undefined') {
            setTimeout(awaitLogin, 100);
            return;
        }
        init();
    }

    function getPanelHandles(e) {
        if (getId('user-info') === null) {
            setTimeout(getPanelHandles, 100);
        }

        var userTabs = getId('user-info');

        if (getElementsByClassName('nav-tabs',userTabs)[0] === undefined) {
            setTimeout(getPanelHandles, 100);
        }

        var navTabs = getElementsByClassName('nav-tabs',userTabs)[0];

        if (getElementsByClassName('tab-content', userTabs)[0] === undefined) {
            setTimeout(getPanelHandles, 100);
        }

        var tabContent = getElementsByClassName('tab-content', userTabs)[0];

        return {
            'userTabs' : userTabs,
            'navTabs' : navTabs,
            'tabContent' : tabContent
        };
    }

    function initTab() {
        try {
            // Get handles on the tabs and panels
            var tabHandles = getPanelHandles();

            // Create the tab
            var myTab = document.createElement('li');
            myTab.innerHTML = '<a id="sidepanel-behavinator-tab" href="#sidepanel-behavinator" data-toggle="tab" style="padding: 4px;">Validator</a>';

            // Create the panel
            var myTabPanel = document.createElement('section');
            myTabPanel.id = "sidepanel-behavinator";
            myTabPanel.className = "tab-pane";

            // Create the tab content
            var myTabContent = document.createElement('p');
            myTabContent.style.padding = "padding: 8px 16px;";
            myTabContent.id = "behavinatorTab";
            WrapValidator(myTabContent);

            // Attach the tab to the tab bar
            tabHandles.navTabs.appendChild(myTab);
            // Attach the content to the panel
            myTabPanel.appendChild(myTabContent);
            // Attach the panel to the sidebar
            tabHandles.tabContent.appendChild(myTabPanel);
        } catch (err) {
            debugLog(err.message);
        }
    }

    function WrapValidator(myTab) {
        // Find out where validator is
        var Validator = $('a[href*="t=76488"]:first').parent().parent().parent()[0];
        if (Validator.parentElement.id != 'sidepanel-behavinator') {
            while (Validator.childNodes.length > 0) {
                myTab.appendChild(Validator.childNodes[0]);
            }
        }
        return;
    }

    function init() {
        initTab();
    }

    debugLog("Starting up");
    awaitLogin();
})();
