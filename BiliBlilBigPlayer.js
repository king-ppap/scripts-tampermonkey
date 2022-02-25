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
  let isInit = false;
  function updatePlayerBar() {
    const playerBar = document.getElementsByClassName("player-mobile-top-bar")[0];

    if (!playerBar)
      return;

    var elContainer = document.createElement("div");
    var elBtn = document.createElement("button");

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
      const bilibiliPlayer = document.getElementById("bilibiliPlayer");
      if (bilibiliPlayer) {
        console.warn("Cbserver init.");
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
