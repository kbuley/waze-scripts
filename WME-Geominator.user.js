// ==UserScript==
// @name                WME Geominator
// @author              IAmTheKLB
// @namespace           https://greasyfork.org/en/users/30893-kevin-buley
// @description         Import geojson and manage geojson files
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.02
// @grant               none
// @copyright           2016 Kevin Buley
// ==/UserScript==


function debugLog(message) {
  window.console.log("WME-Geominator:" + message);
  return;
}

// Thanks, Glodenox!
function awaitLogin(e) {
  if (e && e.user === null) {
    return;
  }
  if (typeof Waze === 'undefined' ||
      typeof Waze.loginManager === 'undefined') {
    setTimeout(awaitLogin, 100);
    return;
  }
  if (!Waze.loginManager.hasUser()) {
    Waze.loginManager.events.register("login", null, awaitLogin);
    Waze.loginManager.events.register("loginStatus", null, awaitLogin);
    return;
  }
  // TODO: check whether this is actually useful to do
  if (typeof document.getElementById('WazeMap') === undefined) {
    setTimeout(awaitLogin, 100);
    return;
  }
  init();
}

function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
      if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

function initTab() {
  var addon = document.createElement('section');
  addon.id = "sidepanel-geominator";
  addon.className = "tab-pane";

  var section = document.createElement('p');
  section.style.paddingTop = "0px";
  section.id = "geominatorOptions";
  section.innerHTML  = '<b>WME Geominator</b><br>' +
      '<input type="checkbox" id="_cbGeominator" title="Be Clicked" /> Gotta get clicked! ' +
      '<br>';

  addon.appendChild(section);

  var userTabs = getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];
  debugLog("newtab");
  var newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-geominator" data-toggle="tab" title="Geominator">Geominator</a>';
  navTabs.appendChild(newtab);

  tabContent.appendChild(addon);

}

function init() {
  debugLog("We made it!");
  initTab();
}
awaitLogin();
