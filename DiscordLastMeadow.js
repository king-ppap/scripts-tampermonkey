// ==UserScript==
// @name         Discord Activity: Last Meadow
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Auto Adventure + Auto Craft + Auto Battle for Discord activities
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let running = false;
  let timeoutId = null;
  let autoRunning = false;

  const keyCodeMap = {
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  async function pressArrowSequence() {
    // Poll until unpressed arrows appear (up to 6s)
    let characters = [];
    for (let attempt = 0; attempt < 30; attempt++) {
      characters = document.querySelectorAll('.character__34527 img:not(.arrowSuccess__34527)');
      console.log(`[Last Meadow] Poll attempt ${attempt + 1}: found ${characters.length} unpressed arrows`);
      if (characters.length) break;
      await sleep(200);
    }

    if (!characters.length) {
      console.log('[Last Meadow] No unpressed arrows found.');
      return;
    }

    const keys = [...characters].map(img => img.alt);
    console.log('[Last Meadow] Arrow seq:', keys);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
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
      await sleep(200);
    }
  }

  let autoCraftRunning = false;

  async function autoCraftLoop() {
    const CRAFT_BTN = '#app-mount > div.appAsidePanelWrapper_a3002d > div > div:nth-child(6) > div > div.container__73695 > div.main__8e80e > div > div.actions__8e80e > div.gameActions__8e80e > div:nth-child(2) > div.button__65fca.buttonWhite__65fca.clickable__5c90e:not(.disabled__65fca)';

    while (autoCraftRunning) {
      const craftBtn = document.querySelector(CRAFT_BTN);
      if (craftBtn) {
        console.log('[Last Meadow] Craft button found, clicking...');
        craftBtn.click();
        await sleep(500);

        for (let round = 1; round <= 3; round++) {
          console.log(`[Last Meadow] Arrow round ${round}/3`);
          if (round > 1) await sleep(100);
          await pressArrowSequence();
          console.log(`[Last Meadow] Arrow round ${round}/3 done`);
        }

        await sleep(1000);
        const CONTINUE_BTN = '#app-mount > div.appAsidePanelWrapper_a3002d > div > div:nth-child(6) > div > div.container__73695 > div.container__24749 > div.rewardsContainer__24749 > div > div.continueButtonWrapper__24749 > div';
        const continueBtn = document.querySelector(CONTINUE_BTN);
        if (continueBtn) {
          continueBtn.click();
          console.log('[Last Meadow] Continue button clicked.');
        }
      } else {
        console.log('[Last Meadow] Waiting for Craft button (disabled or not found)...');
        await sleep(500);
      }
    }
  }

  async function findAndClickMatches() {
    const CONTINUE_BTN = '#app-mount > div.appAsidePanelWrapper_a3002d > div > div:nth-child(6) > div > div.container__73695 > div:nth-child(2) > div > div.rewardsContainer__24749 > div > div.continueButtonWrapper__24749 > div';

    const items = document.querySelectorAll('.gridItem__0dcd3:not(.matched__0dcd3)');
    if (!items.length) {
      console.log('[Last Meadow] No grid items found.');
      return;
    }

    const groups = {};
    items.forEach(item => {
      const firstPath = item.querySelector('svg path');
      if (!firstPath) return;
      const key = firstPath.getAttribute('d');
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    console.log('[Last Meadow] Grid groups:', Object.keys(groups).map(k => `${k.slice(0, 40)}...: ${groups[k].length}`));

    for (const [key, cards] of Object.entries(groups)) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].click();
        console.log(`[Last Meadow] grid clicked [${i + 1}/${cards.length}]: ${key.slice(0, 40)}...`);
        await sleep(200);
      }
      await sleep(1000);
    }

    await sleep(1000);

    const continueBtn = document.querySelector(CONTINUE_BTN);
    if (continueBtn) {
      continueBtn.click();
      console.log('[Last Meadow] Continue button clicked.');
    } else {
      console.log('[Last Meadow] Continue button not found.');
    }
  }

  async function autoLoop() {
    const BATTLE_BTN = '#app-mount > div.appAsidePanelWrapper_a3002d > div > div:nth-child(6) > div > div.container__73695 > div.main__8e80e > div > div.actions__8e80e > div.gameActions__8e80e > div:nth-child(3) > div.button__65fca.buttonWhite__65fca.clickable__5c90e:not(.disabled__65fca)';

    while (autoRunning) {
      const battleBtn = document.querySelector(BATTLE_BTN);
      if (battleBtn) {
        console.log('[Last Meadow] Battle button found, clicking...');
        battleBtn.click();
        await sleep(1000);
        await findAndClickMatches();
        await sleep(1000);
      } else {
        console.log('[Last Meadow] Waiting for Battle button...');
        await sleep(500);
      }
    }
  }

  // UI
  const ui = document.createElement('div');
  ui.innerHTML = `
    <div id="dab-panel" style="
      position: fixed; top: 20px; left: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 8px;
      font-family: sans-serif;
    ">
      <button id="dab-clicker" style="
        padding: 8px 16px; background: #5865f2; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">▶ Start Adventure</button>
      <button id="dab-auto-craft" style="
        padding: 8px 16px; background: #e67e22; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">⚒️ Start Auto Craft</button>
      <button id="dab-auto" style="
        padding: 8px 16px; background: #9b59b6; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">🤖 Start Auto Battle</button>
    </div>
  `;
  document.body.appendChild(ui);

  document.getElementById('dab-clicker').addEventListener('click', () => {
    const btn = document.getElementById('dab-clicker');
    running = !running;
    if (running) {
      btn.textContent = '⏹ Stop Adventure';
      btn.style.background = '#ed4245';
      clickLoop();
    } else {
      btn.textContent = '▶ Start Adventure';
      btn.style.background = '#5865f2';
      clearTimeout(timeoutId);
    }
  });

  document.getElementById('dab-auto-craft').addEventListener('click', () => {
    const btn = document.getElementById('dab-auto-craft');
    autoCraftRunning = !autoCraftRunning;
    if (autoCraftRunning) {
      btn.textContent = '⏹ Stop Auto Craft';
      btn.style.background = '#ed4245';
      autoCraftLoop();
    } else {
      btn.textContent = '⚒️ Start Auto Craft';
      btn.style.background = '#e67e22';
      console.log('[Last Meadow] Auto Craft stopped.');
    }
  });

  document.getElementById('dab-auto').addEventListener('click', () => {
    const btn = document.getElementById('dab-auto');
    autoRunning = !autoRunning;
    if (autoRunning) {
      btn.textContent = '⏹ Stop Auto Battle';
      btn.style.background = '#ed4245';
      autoLoop();
    } else {
      btn.textContent = '🤖 Start Auto Battle';
      btn.style.background = '#9b59b6';
      console.log('[Last Meadow] Auto loop stopped.');
    }
  });

})();
