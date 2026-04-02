// ==UserScript==
// @name         Bilibili Big Player
// @namespace    http://tampermonkey.net/
// @version      1.3.1
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
  const TEXT_COLOR = '#4c93ff';
  // let stylesheet = document.styleSheets[0]
  // stylesheet.insertRule(`.bstar-video-card__title-text { color: ${TEXT_COLOR}; }`, 0);
  // stylesheet.insertRule(`.bstar-sidebar__link { color: ${TEXT_COLOR} !important; }`, 0);

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
    elBtn.innerText = "BIG (t)";
    elBtn.style.padding = "10px";
    elBtn.style.background = "#0c3d878c";
    elBtn.style.color = "#fff";
    elBtn.style.borderRadius = "10px";
    elBtn.style.cursor = "pointer";
    elBtn.addEventListener('click', toggleBigPicture);
    playerBar.prepend(elContainer);
  }
  const toggleBigPicture = () => {
      if (!bigState) {
        document.querySelector(".bstar-header").style.display = "none"
        bilibiliPlayer.style.zIndex = "999";
        bilibiliPlayer.style.position = "fixed";
        bilibiliPlayer.style.left = "0";
        bilibiliPlayer.style.top = "0";
        document.body.style.overflow = "hidden"
      } else {
        document.querySelector(".bstar-header").style.display = "grid"
        bilibiliPlayer.style.zIndex = "";
        bilibiliPlayer.style.position = "";
        bilibiliPlayer.style.left = "";
        bilibiliPlayer.style.top = "";
        document.body.style.overflow = "auto";
      }
      bigState = !bigState
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
          case "KeyW":
              console.log('KeyW ip-widescreen-button');
              // document.querySelector(".ip-widescreen-button").click()
              trigger(document.querySelector(".ip-widescreen-button"), 'click');
              // trigger(document.querySelector(".ip-widescreen-button"), 'mousedown');
              // trigger(document.querySelector(".ip-widescreen-button"), 'mouseup');
              break;
          case "KeyT":
              console.log('KeyT big pic');
              toggleBigPicture();
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
      console.log("Init Tampermonkey")
      // Dark Theme
      document.querySelector('html').classList.add('night-mode')

      document.body.style.backgroundColor = "#000";
      document.body.style.color = "rgb(217, 217, 217)";

      document.querySelector(".bstar-header").style.backgroundColor = '#000';
      document.querySelector(".bstar-header").style.borderBottomWidth = '0';

      const style = document.createElement('style');
      style.textContent = `
         .layout-grey {
            background-color: #000 !important;
         }
         .ep-item--active, .ep-item--active:hover {
            color: #06b6f2 !important;
            background-color: rgba(6, 182, 242, .1) !important;
         }
      `;

      document.head.appendChild(style);

      if (document.querySelector(".interactive")) document.querySelector(".interactive").style.backgroundColor = '#000';
        const searchBar = document.querySelector(".bstar-header-search-bar__input");
        if (searchBar) {
            // searchBar.style.backgroundColor = '#fff';
            searchBar.style.color = '#fff';
            document.querySelector(".bstar-header-search-bar").style.backgroundColor = '#3b3b3b';
        }

      document.querySelectorAll('.bstar-video-card__title-text').forEach(e =>( e.style.color = '#d1d1d1'));
      document.querySelectorAll('.bstar-video-card__desc').forEach(e =>( e.style.color = '#d1d1d1'));
      document.querySelectorAll('.bstar-header__action').forEach(e =>( e.style.color = '#d1d1d1'));
      document.querySelectorAll('.bstar-header__download-btn').forEach(e =>( e.style.color = '#d1d1d1'));
      document.querySelectorAll('.bstar-header__left-menu').forEach(e =>( e.style.color = '#d1d1d1'));
      document.querySelectorAll('.bstar-sidebar__menu').forEach(e =>( e.style.color = 'red'));
      // Another page
      if (document.querySelector(".layout__content")) document.querySelector(".layout__content").style.backgroundColor = '#000';
      if (document.querySelector(".layout__wrapper")) document.querySelector(".layout__wrapper").style.backgroundColor = '#000';
      if (document.querySelector(".bstar-sidebar")) {
            document.querySelector(".bstar-sidebar").style.backgroundColor = '#000';
            document.querySelectorAll('.bstar-sidebar__link').forEach(e =>( e.style.color = '#d1d1d1'));
      }
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
      }
      isInit = true;
    }
  }, 500);

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
