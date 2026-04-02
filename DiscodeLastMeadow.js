// ==UserScript==
// @name         Discord Activity: Last Meadow
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto clicker + arrow sequence + grid matcher for Discord activities
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
        const btnDragon = document.querySelector('.dragonClickable__8e80e');
      if (btn) btn.click();
        if (btnDragon) btnDragon.click();
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
        console.log('[Last Meadow] Arrow seq:', keys);

        keys.forEach((key, i) => {
            const delay = (Math.floor(Math.random() * (240 - 160 + 1)) + 160) * i;
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
                console.log(`[Last Meadow] pressed: ${key}`);
            }, delay);
        });
    }


  function findAndClickMatches() {
    const items = document.querySelectorAll('.gridItem__0dcd3:not(.matched__0dcd3)');
    if (!items.length) {
      alert('No grid items found on screen.');
      return;
    }

    // Group unmatched items by first path's d attribute
    const groups = {};
    items.forEach(item => {
      const firstPath = item.querySelector('svg path');
      if (!firstPath) return;
      const key = firstPath.getAttribute('d');
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    console.log('[Last Meadow] Grid groups:', Object.keys(groups).map(k => `${k.slice(0, 40)}...: ${groups[k].length}`));

    // Click all cards in each group: ~200ms between cards, ~1s between groups
    let setDelay = 0;
    Object.entries(groups).forEach(([key, cards]) => {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.click();
          console.log(`[Last Meadow] grid clicked [${i + 1}/${cards.length}]: ${key.slice(0, 40)}...`);
        }, setDelay + i * 200);
      });
      setDelay += cards.length * 200 + 1000;
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
      <button id="dab-grid" style="
        padding: 8px 16px; background: #fee75c; color: #000;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">🔲 Match Grid</button>
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
  document.getElementById('dab-grid').addEventListener('click', findAndClickMatches);
})();
