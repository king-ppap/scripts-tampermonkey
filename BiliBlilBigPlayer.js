// ==UserScript==
// @name         Bilibili Big Player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BIG PLAYER click "BIG" Button on top left of player
// @author       king-ppap
// @match        https://www.bilibili.tv/th/play/*
// @icon         https://p.bstarstatic.com/fe-static/deps/bilibili_tv.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  function observeDOM() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
      if (!obj || obj.nodeType !== 1) return;

      if (MutationObserver) {
        // define a new observer
        const mutationObserver = new MutationObserver(callback);

        // have the observer observe foo for changes in children
        mutationObserver.observe(obj, { childList: true, subtree: true });
        return mutationObserver;
      }

      // browser support fallback
      else if (window.addEventListener) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    }
  }
  const bilibiliPlayer = document.getElementById("bilibiliPlayer");
  const playerBar = document.getElementsByClassName("player-mobile-top-bar")[0];

  async function addBigPlayButton() {
    let bigState = false;
    let interV = setInterval(() => {
      if (playerBar) {
        playerBar.innerHTML = `<div
            class="player-mobile-control-btn">
          <button id="playBigq"
            style="
              padding: 10px;
              background: #0c3d878c;
              color: #fff;
              border-radius: 25px;
          ">BIG</button>
      </div>` + playerBar.innerHTML;
        document.getElementById("playBigq").addEventListener('click', () => {
          if (!bigState) {
            bilibiliPlayer.style.zIndex = "999";
            bilibiliPlayer.style.position = "fixed";
            bilibiliPlayer.style.left = "0";
            bilibiliPlayer.style.top = "0";
            document.body.style.overflow = "hidden"
          } else {
            bilibiliPlayer.style.zIndex = "";
            bilibiliPlayer.style.position = "";
            bilibiliPlayer.style.left = "";
            bilibiliPlayer.style.top = "";
            document.body.style.overflow = "auto";
          }
          bigState = !bigState
        });
        clearInterval(interV);
      }
    }, 100);

  }

  observeDOM(playerBar, (e) => {
    console.log(e);
    e.forEach(record => {
      console.log(record.addedNodes.length, record.removedNodes.length);
      // record.removedNodes.length
      //   addBigPlayButton();
    });

  })

  document.getElementsByClassName("main-area media-size__video-wrap")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.height = "450px";

  const tempPlayer = document.getElementsByClassName("media-size__video");
  for (let index = 0; index < tempPlayer.length; index++) {
    tempPlayer[index].style.height = "80vh";
    tempPlayer[index].style.width = "100%";
  }
})();