// ==UserScript==
// @name         Discord Activity: Last Meadow
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto clicker + arrow sequence presser for Discord activities
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let running = false;
  let timeoutId = null;

  const keyCodeMap = {
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
  };

  function clickLoop() {
    if (!running) return;
    const delay = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
    timeoutId = setTimeout(() => {
      const btn = document.querySelector('.button__65fca');
      if (btn) btn.click();
      clickLoop();
    }, delay);
  }

  function pressArrowSequence() {
    const characters = document.querySelectorAll('.character__34527 img');
    if (!characters.length) {
      alert('No arrow sequence found on screen.');
      return;
    }

    const keys = [...characters].map(img => img.alt);
    console.log('[Arrow Seq]', keys);

    keys.forEach((key, i) => {
      const delay = (Math.floor(Math.random() * (200 - 120 + 1)) + 120) * i;
      setTimeout(() => {
        const target = document.activeElement || document.body;
        ['keydown', 'keypress', 'keyup'].forEach(type => {
          target.dispatchEvent(new KeyboardEvent(type, {
            key,
            code: key,
            keyCode: keyCodeMap[key],
            which: keyCodeMap[key],
            bubbles: true,
            cancelable: true,
            composed: true,
          }));
        });
        console.log(`[Arrow Seq] pressed: ${key}`);
      }, delay);
    });
  }

  // UI
  const ui = document.createElement('div');
  ui.innerHTML = `
    <div id="dab-panel" style="
      position: fixed; bottom: 20px; right: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 8px;
      font-family: sans-serif;
    ">
      <button id="dab-clicker" style="
        padding: 8px 16px; background: #5865f2; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">▶ Start Clicker</button>
      <button id="dab-arrow" style="
        padding: 8px 16px; background: #57f287; color: #000;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">⬆ Press Sequence</button>
    </div>
  `;
  document.body.appendChild(ui);

  document.getElementById('dab-clicker').addEventListener('click', () => {
    const btn = document.getElementById('dab-clicker');
    running = !running;
    if (running) {
      btn.textContent = '⏹ Stop Clicker';
      btn.style.background = '#ed4245';
      clickLoop();
    } else {
      btn.textContent = '▶ Start Clicker';
      btn.style.background = '#5865f2';
      clearTimeout(timeoutId);
    }
  });

  document.getElementById('dab-arrow').addEventListener('click', pressArrowSequence);
})();
