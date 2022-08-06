// ==UserScript==
// @name         Bilibili Big Player
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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
    // the actual 'trigger' function
  function trigger (el, etype, custom) {
      const evt = custom ?? new Event( etype, { bubbles: true } );
      el.dispatchEvent( evt );
  };
  function playerShortcut(event) {
      const { code } = event;
      console.log(code);
      switch (code) {
          case "KeyF":
              console.log('KeyF fullscreen');
              trigger(document.querySelector(".player-mobile-btn-fullscreen"), 'mousedown');
              break;
          case "KeyM":
              console.log('KeyM mute');
              trigger(document.querySelector(".player-mobile-control-btn-vol"), 'mousedown');
              trigger(document.querySelector(".player-mobile-control-btn-vol"), 'mouseup');
              break;
          case "KeyT":
              console.log('KeyT ip-widescreen-button');
              trigger(document.querySelector(".ip-widescreen-button").parentElement.parentElement.parentElement, 'mousedown');
              trigger(document.querySelector(".ip-widescreen-button").parentElement.parentElement.parentElement, 'mouseup');
              break;
      }
  }

  const observer = new MutationObserver(es => {
    const playerMobile = es.flatMap(e => [...e.addedNodes])
      .filter(x => x.className === 'player-mobile');

    if (playerMobile) {
      updatePlayerBar();

      document.body.addEventListener('keypress', playerShortcut)
    }

  });

  let interV = setInterval(() => {
    if (!isInit) {
      // Dark Theme
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "rgb(217, 217, 217)";

      document.querySelector(".bstar-header").style.backgroundColor = '#000';
      document.querySelector(".bstar-header").style.borderBottomWidth = '0';
      if (document.querySelector(".interactive")) document.querySelector(".interactive").style.backgroundColor = '#000';
      document.querySelector(".bstar-header-search-bar__input").style.backgroundColor = '#000';
      document.querySelector(".bstar-header-search-bar__input").style.color = '#fff';

      // Another page
      if (document.querySelector(".layout__content")) document.querySelector(".layout__content").style.backgroundColor = '#000';
      if (document.querySelector(".layout__wrapper")) document.querySelector(".layout__wrapper").style.backgroundColor = '#000';
      if (document.querySelector(".bstar-sidebar")) document.querySelector(".bstar-sidebar").style.backgroundColor = '#000';
      if (document.querySelector(".trending")) document.querySelector(".trending").style.backgroundColor = '#000';

     // document.querySelectorAll(".video-*").forEach(e => {
      //  e.style.color = "rgb(217, 217, 217)";
     // });

      document.querySelectorAll(".bstar-web__header").forEach(e => {
        e.style.background = "rgba(26,26,26,.85)"
      });
      document.querySelector("#search-bar")?.classList.add("comp-search-bar-dark");

      document.querySelector(".bstar-backtop")?.classList.add("dark");
      document.querySelector(".sidebar__link")?.classList.add("category-title-dark");

      bilibiliPlayer = document.getElementById("bilibiliPlayer");
      if (bilibiliPlayer) {
        bilibiliPlayer.style.width = "100%";
        bilibiliPlayer.style.height = "100%";
        observer.observe(bilibiliPlayer, { childList: true });
        updatePlayerBar();
        clearInterval(interV);
        isInit = true;
      }
    }
  }, 100);

    /*
  if (document.querySelector("main-area media-size__video-wrap")) document.querySelector("main-area media-size__video-wrap").style.width = "100%";
  document.querySelector("episode-area select-ep").style.width = "100%";
  document.querySelector("episode-area select-ep").style.height = "450px";
  document.querySelector("layout-body media-width").style.width = "100%";
  document.querySelector("video-container media-width__video").style.width = "100%";
*/
  const tempPlayer = document.getElementsByClassName("media-size__video");
  for (let index = 0; index < tempPlayer.length; index++) {
    tempPlayer[index].style.height = "80vh";
    tempPlayer[index].style.width = "100%";
  }
})();
