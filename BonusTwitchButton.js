// ==UserScript==
// @name         Bonus Twitch Button
// @namespace    http://tampermonkey.net/
// @version      0.0.1
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
          let temp = document.querySelector('[d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z"]');
          if (temp) {
              temp.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.click();
              const timeTemp = (waiting*SET_TIME)/1000;
              console.log(`Get bonus for ${++count} times AND waiting for ${timeTemp} sec.`);
              histo.push(timeTemp);
              waiting = 0;
          } else {
              ++waiting;
          }
      },
      SET_TIME
  );
})();
