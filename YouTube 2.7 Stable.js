// ==UserScript==
// @name         YT AutoView 2.7
// @namespace    https://github.com/Savvy08
// @version      2.7
// @description  Автоматический просмотр YouTube с имитацией поведения пользователя.
// @author       Savvy
// @match        https://www.youtube.com/watch*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ====== Настройки ======
  let enabled = true;
  let limitEnabled = true;
  let videoLimit = 10;
  let viewingTimeMs = 5 * 60 * 1000; // 5 минут
  let watchedVideos = 0;

  // ====== Меню Tampermonkey ======
  GM_registerMenuCommand('Перезапуск', () => location.reload());

  GM_registerMenuCommand('Отключить лимит', () => {
    limitEnabled = false;
    alert('🔁 Лимит видео отключён');
  });

  GM_registerMenuCommand('Изменить лимит видео', () => {
    const val = prompt('Введите новый лимит видео:', videoLimit);
    if (!isNaN(parseInt(val))) {
      videoLimit = parseInt(val);
      alert(`✅ Новый лимит: ${videoLimit}`);
    }
  });

  GM_registerMenuCommand('Изменить время просмотра', () => {
    const min = prompt('Минут на видео:', viewingTimeMs / 60000);
    if (!isNaN(parseFloat(min))) {
      viewingTimeMs = parseFloat(min) * 60 * 1000;
      alert(`✅ Новое время просмотра: ${min} минут`);
    }
  });

  GM_registerMenuCommand('Показать статус', () => {
    alert(`📊 Статус:\nАктивен: ${enabled}\nПросмотрено: ${watchedVideos}\nЛимит включен: ${limitEnabled}\nЛимит: ${videoLimit}`);
  });

  GM_registerMenuCommand('Остановить скрипт', () => {
    enabled = false;
    alert('⛔ Скрипт остановлен');
  });

  GM_registerMenuCommand('Об авторе (@Savvy)', () => {
    alert('👨‍💻 Скрипт разработан @Savvy08 — github.com/Savvy08');
  });

  GM_registerMenuCommand('Обновить скрипт', () => location.reload());

  // ====== Логика просмотра ======
  function simulateMouseMove() {
    const evt = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: Math.random() * window.innerWidth,
      clientY: Math.random() * window.innerHeight,
    });
    window.dispatchEvent(evt);
  }

  function simulateMouseHoverOverVideo() {
    const video = document.querySelector('video');
    if (video) {
      const rect = video.getBoundingClientRect();
      const evt = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      });
      video.dispatchEvent(evt);
    }
  }

  function waitAndGoNext() {
    const interval = setInterval(() => {
      if (!enabled) return clearInterval(interval);

      const next = document.querySelector('.ytp-next-button');
      if (next && !next.disabled) {
        next.click();
        watchedVideos++;
        if (limitEnabled && watchedVideos >= videoLimit) {
          enabled = false;
          alert('✅ Достигнут лимит просмотра. Скрипт остановлен.');
          clearInterval(interval);
        }
      }
    }, viewingTimeMs);
  }

  function observeVideo() {
    const video = document.querySelector('video');
    if (!video || !enabled) return;

    video.play();

    const interactionInterval = setInterval(() => {
      if (!enabled) return clearInterval(interactionInterval);
      simulateMouseMove();
      simulateMouseHoverOverVideo();
      window.scrollBy(0, Math.random() * 30 - 15);
    }, 10000);

    waitAndGoNext();
  }

  // Ждать загрузки видео
  const readyCheck = setInterval(() => {
    if (document.querySelector('video')) {
      clearInterval(readyCheck);
      observeVideo();
    }
  }, 2000);

  // Метка @Savvy в углу
  const label = document.createElement('div');
  label.textContent = '@Savvy';
  label.style = 'position:fixed;bottom:10px;right:10px;font-size:12px;color:white;background:#000;padding:3px 8px;border-radius:6px;z-index:9999;opacity:0.7';
  document.body.appendChild(label);
})();
