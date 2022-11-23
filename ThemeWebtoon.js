// ==UserScript==
// @name         Black Background Webtoon 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.webtoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('content').style.backgroundColor = 'black';
})();
