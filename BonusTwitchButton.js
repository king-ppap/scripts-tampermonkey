// ==UserScript==
// @name         Bonus Twitch Button
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Auto Click Bonus Twitch Button
// @author       king-ppap
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-16-52e571ffea063af7a7f4.png
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/king-ppap/scripts-tampermonkey/main/BonusTwitchButton.js
// @updateURL    https://raw.githubusercontent.com/king-ppap/scripts-tampermonkey/main/BonusTwitchButton.js
// ==/UserScript==

(function () {
  'use strict';
  /* HOW TO Click Bonus Twitch botton */
  let SET_TIME = 1000; // ms
  let count = 0, waiting = 0, histo = [];
  setInterval(
      () => {
          let temp = document.querySelector('.kIlsPe');
          if (temp) {
              temp.click();
              const timeTemp = (waiting*SET_TIME)/1000;
              console.log(`${new Date().toISOString()}Get bonus for ${++count} times AND waiting for ${timeTemp} sec.`);
              histo.push(timeTemp);
              waiting = 0;
          } else {
              ++waiting;
          }
      },
      SET_TIME
  );
})();
