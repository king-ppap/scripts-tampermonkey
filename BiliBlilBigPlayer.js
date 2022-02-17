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
  let bigState = false;
  let interV = setInterval(() => {
    const playerBar = document.getElementsByClassName("player-mobile-top-bar")[0];
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
        const bilibiliPlayer = document.getElementById("bilibiliPlayer");
        if (!bigState) {
          bilibiliPlayer.style.zIndex = "999";
          bilibiliPlayer.style.position = "fixed";
          bilibiliPlayer.style.left = "0";
          bilibiliPlayer.style.top = "0";
        } else {
          bilibiliPlayer.style.zIndex = "";
          bilibiliPlayer.style.position = "";
          bilibiliPlayer.style.left = "";
          bilibiliPlayer.style.top = "";
        }
        bigState = !bigState
      });
      clearInterval(interV);
    }
  }, 100);
  document.getElementsByClassName("main-area media-size__video-wrap")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.height = "450px";

  const tempPlayer = document.getElementsByClassName("media-size__video");
  for (let index = 0; index < tempPlayer.length; index++) {
    tempPlayer[index].style.height = "80vh";
    tempPlayer[index].style.width = "100%";
  }
})();