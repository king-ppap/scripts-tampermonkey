// ==UserScript==
// @name         Bilibili Big Player
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  BIG PLAYER click "BIG" Button on top left of player
// @author       king-ppap
// @match        https://www.bilibili.tv/*
// @icon         https://p.bstarstatic.com/fe-static/deps/bilibili_tv.ico
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/king-ppap/scripts-tampermonkey/main/BiliBlilBigPlayer.js
// @updateURL    https://raw.githubusercontent.com/king-ppap/scripts-tampermonkey/main/BiliBlilBigPlayer.js
// ==/UserScript==

(function () {
  'use strict';
  let bigState = false;
  let isInit = false;
  let bilibiliPlayer;
  function updatePlayerBar() {
    const playerBar = document.getElementsByClassName("player-mobile-top-bar")[0];

    if (!playerBar) return;

    const elContainer = document.createElement("div");
    const elBtn = document.createElement("button");

    elContainer.className = "player-mobile-control-btn";
    elContainer.append(elBtn);
    elBtn.innerText = "BIG";
    elBtn.style.padding = "10px";
    elBtn.style.background = "#0c3d878c";
    elBtn.style.color = "#fff";
    elBtn.style.borderRadius = "25px";
    elBtn.style.cursor = "pointer";
    elBtn.addEventListener('click', () => {
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
    playerBar.prepend(elContainer);
  }

  const observer = new MutationObserver(es => {
    const playerMobile = es.flatMap(e => [...e.addedNodes])
      .filter(x => x.className === 'player-mobile');

    if (playerMobile) {
      updatePlayerBar();
    }

  });

  let interV = setInterval(() => {
    if (!isInit) {
      // Dark Theme
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "rgb(217, 217, 217)";
      document.querySelectorAll(".bstar-web__header").forEach(e => {
        e.style.background = "rgba(26,26,26,.85)"
      });
      document.querySelector("#search-bar")?.classList.add("comp-search-bar-dark");
      document.querySelector(".bstar-backtop")?.classList.add("dark");
      document.querySelector(".sidebar__link")?.classList.add("category-title-dark");

      bilibiliPlayer = document.getElementById("bilibiliPlayer");
      if (bilibiliPlayer) {
        observer.observe(bilibiliPlayer, { childList: true });
        updatePlayerBar();
        clearInterval(interV);
        isInit = true;
      }
    }
  }, 100);

  document.getElementsByClassName("main-area media-size__video-wrap")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.width = "100%";
  document.getElementsByClassName("episode-area select-ep")[0].style.height = "450px";
  document.getElementsByClassName("layout-body media-width")[0].style.width = "100%";
  document.getElementsByClassName("video-container media-width__video")[0].style.width = "100%";

  const tempPlayer = document.getElementsByClassName("media-size__video");
  for (let index = 0; index < tempPlayer.length; index++) {
    tempPlayer[index].style.height = "80vh";
    tempPlayer[index].style.width = "100%";
  }
})();
