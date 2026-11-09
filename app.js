/**
 * RĂNG ĐEN MÔI ĐỎ — Heritage Broadsheet Newspaper Logic
 * Handles Opening Language Captcha Gate (VI / EN), Web/Mobile View Toggle & QR Export
 */

(function () {
  'use strict';

  const PUBLIC_GITHUB_PAGES_URL = 'https://ducthanh582.github.io/rang-den-moi-do';

  function getDefaultMobileQrUrl() {
    return `${PUBLIC_GITHUB_PAGES_URL}/?view=mobile`;
  }

  let currentQrUrl = getDefaultMobileQrUrl();
  const bodyEl = document.body;

  /* ========================================================================
     1. OPENING CAPTCHA & LANGUAGE SELECTION GATE (TIẾNG VIỆT / ENGLISH)
     ======================================================================== */
  const captchaGate = document.getElementById('captcha-gate');
  const captchaCheckboxRow = document.getElementById('captcha-checkbox-row');
  const captchaBoxMark = document.getElementById('captcha-box-mark');
  const captchaError = document.getElementById('captcha-error');
  const btnEnterVi = document.getElementById('btn-enter-vi');
  const btnEnterEn = document.getElementById('btn-enter-en');
  const btnLangVi = document.getElementById('btn-lang-vi');
  const btnLangEn = document.getElementById('btn-lang-en');
  const btnReopenCaptcha = document.getElementById('btn-reopen-captcha');

  let isCaptchaChecked = true;

  function toggleCaptchaCheck() {
    isCaptchaChecked = !isCaptchaChecked;
    if (captchaCheckboxRow) {
      captchaCheckboxRow.classList.toggle('checked', isCaptchaChecked);
      captchaCheckboxRow.setAttribute('aria-checked', String(isCaptchaChecked));
    }
    if (captchaBoxMark) {
      captchaBoxMark.textContent = isCaptchaChecked ? '✓' : '';
    }
    if (isCaptchaChecked && captchaError) {
      captchaError.style.display = 'none';
    }
  }

  if (captchaCheckboxRow) {
    captchaCheckboxRow.addEventListener('click', toggleCaptchaCheck);
    captchaCheckboxRow.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleCaptchaCheck();
      }
    });
  }

  function setLanguage(lang) {
    const normalized = lang === 'en' ? 'en' : 'vi';
    bodyEl.setAttribute('data-lang', normalized);
    document.documentElement.setAttribute('lang', normalized);

    if (btnLangVi && btnLangEn) {
      btnLangVi.classList.toggle('active', normalized === 'vi');
      btnLangEn.classList.toggle('active', normalized === 'en');
    }
  }

  function enterNewspaperWithLang(lang) {
    if (!isCaptchaChecked) {
      if (captchaError) captchaError.style.display = 'block';
      return;
    }
    setLanguage(lang);
    if (captchaGate) {
      captchaGate.classList.add('hidden');
    }
  }

  if (btnEnterVi) {
    btnEnterVi.addEventListener('click', () => enterNewspaperWithLang('vi'));
  }
  if (btnEnterEn) {
    btnEnterEn.addEventListener('click', () => enterNewspaperWithLang('en'));
  }
  if (btnLangVi) {
    btnLangVi.addEventListener('click', () => setLanguage('vi'));
  }
  if (btnLangEn) {
    btnLangEn.addEventListener('click', () => setLanguage('en'));
  }
  if (btnReopenCaptcha && captchaGate) {
    btnReopenCaptcha.addEventListener('click', () => {
      captchaGate.classList.remove('hidden');
    });
  }

  /* ========================================================================
     2. VIEW MODE SWITCHING (WEB BROADSHEET <-> MOBILE SHEET & QR)
     ======================================================================== */
  const btnViewWeb = document.getElementById('btn-view-web');
  const btnViewMobile = document.getElementById('btn-view-mobile');

  function setViewMode(mode) {
    const normalized = mode === 'mobile' ? 'mobile' : 'web';
    bodyEl.setAttribute('data-view-mode', normalized);

    if (btnViewWeb && btnViewMobile) {
      btnViewWeb.classList.toggle('active', normalized === 'web');
      btnViewMobile.classList.toggle('active', normalized === 'mobile');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnViewWeb) {
    btnViewWeb.addEventListener('click', () => setViewMode('web'));
  }
  if (btnViewMobile) {
    btnViewMobile.addEventListener('click', () => setViewMode('mobile'));
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'mobile') {
    setViewMode('mobile');
  }
  if (params.get('lang') === 'en' || params.get('lang') === 'vi') {
    setLanguage(params.get('lang'));
  }

  /* ========================================================================
     3. QR CODE RENDERING & POSTER DOWNLOAD
     ======================================================================== */
  const qrBroadsheetBox = document.getElementById('qr-broadsheet-box');
  const qrMobileBox = document.getElementById('qr-mobile-box');
  const qrModalBox = document.getElementById('qr-modal-box');
  const qrUrlInput = document.getElementById('qr-url-input');
  const qrModalUrlInput = document.getElementById('qr-modal-url-input');

  function renderSingleQr(container, text, size) {
    if (!container) return;
    container.innerHTML = '';

    if (typeof window.QRCode === 'function') {
      new window.QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: '#061316',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } else {
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=061316&bgcolor=ffffff&data=${encodeURIComponent(text)}`;
      img.alt = 'QR Code Răng Đen Môi Đỏ';
      container.appendChild(img);
    }
  }

  function renderAllQrCodes(url) {
    currentQrUrl = (url || '').trim() || getDefaultMobileQrUrl();
    if (qrUrlInput) qrUrlInput.value = currentQrUrl;
    if (qrModalUrlInput) qrModalUrlInput.value = currentQrUrl;

    renderSingleQr(qrBroadsheetBox, currentQrUrl, 120);
    renderSingleQr(qrMobileBox, currentQrUrl, 200);
    renderSingleQr(qrModalBox, currentQrUrl, 200);
  }

  renderAllQrCodes(currentQrUrl);

  const btnUpdateQr = document.getElementById('btn-update-qr');
  const btnModalUpdateQr = document.getElementById('btn-modal-update-qr');

  if (btnUpdateQr && qrUrlInput) {
    btnUpdateQr.addEventListener('click', () => renderAllQrCodes(qrUrlInput.value));
  }
  if (btnModalUpdateQr && qrModalUrlInput) {
    btnModalUpdateQr.addEventListener('click', () => renderAllQrCodes(qrModalUrlInput.value));
  }

  /* ========================================================================
     4. QR MODAL CONTROLS
     ======================================================================== */
  const qrModal = document.getElementById('qr-modal');
  const btnOpenQrModal = document.getElementById('btn-open-qr-modal');
  const btnFooterOpenQr = document.getElementById('btn-footer-open-qr');
  const btnCloseQrModal = document.getElementById('btn-close-qr-modal');

  function openQrModal() {
    if (qrModal) qrModal.classList.add('open');
  }
  function closeQrModal() {
    if (qrModal) qrModal.classList.remove('open');
  }

  [btnOpenQrModal, btnFooterOpenQr].forEach((btn) => {
    if (btn) btn.addEventListener('click', openQrModal);
  });
  if (btnCloseQrModal) {
    btnCloseQrModal.addEventListener('click', closeQrModal);
  }
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  /* ========================================================================
     5. DOWNLOAD PRINTABLE QR POSTER (.PNG)
     ======================================================================== */
  function downloadQrPoster() {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1260;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 900, 1260);
    bgGrad.addColorStop(0, '#0b252b');
    bgGrad.addColorStop(0.5, '#123840');
    bgGrad.addColorStop(1, '#061316');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 1260);

    ctx.strokeStyle = 'rgba(224, 66, 130, 0.25)';
    ctx.lineWidth = 2;
    for (let i = -1260; i < 1800; i += 88) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 1260, 1260);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i + 1260, 0);
      ctx.lineTo(i, 1260);
      ctx.stroke();
    }

    ctx.strokeStyle = '#dfbe73';
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, 816, 1176);

    ctx.strokeStyle = '#efedf6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(56, 56, 788, 1148);

    ctx.fillStyle = '#dfbe73';
    ctx.font = 'bold 19px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ẤN BẢN BÁO CHÍ DI SẢN // HERITAGE BROADSHEET ✦', 450, 125);

    ctx.fillStyle = '#f2f0f7';
    ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
    ctx.fillText('RĂNG ĐEN MÔI ĐỎ', 450, 215);

    ctx.fillStyle = '#ff69a6';
    ctx.font = 'italic 26px "Cormorant Garamond", serif';
    ctx.fillText('Tục Nhuộm Răng Đen Cổ Truyền Việt Nam (VI / EN)', 450, 268);

    const qrBoxSize = 440;
    const qrBoxX = (900 - qrBoxSize) / 2;
    const qrBoxY = 330;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

    const sourceCanvas =
      (qrMobileBox && qrMobileBox.querySelector('canvas')) ||
      (qrModalBox && qrModalBox.querySelector('canvas')) ||
      (qrBroadsheetBox && qrBroadsheetBox.querySelector('canvas'));

    if (sourceCanvas) {
      ctx.drawImage(sourceCanvas, qrBoxX + 36, qrBoxY + 36, qrBoxSize - 72, qrBoxSize - 72);
    }

    ctx.fillStyle = '#f2f0f7';
    ctx.font = 'italic 28px "Cormorant Garamond", serif';
    ctx.fillText('“Đánh cho để dài tóc • Đánh cho để đen răng”', 450, 845);

    ctx.fillStyle = '#dfbe73';
    ctx.font = 'bold 21px "Be Vietnam Pro", sans-serif';
    ctx.fillText('QUÉT MÃ QR ĐỂ ĐỌC BÁO SONG NGỮ VIỆT – ANH', 450, 940);

    ctx.fillStyle = '#cdd0dc';
    ctx.font = '17px "Space Mono", monospace';
    ctx.fillText(currentQrUrl, 450, 990);

    const link = document.createElement('a');
    link.download = 'QR-Bao-Rang-Den-Moi-Do.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  const btnDownloadQrPoster = document.getElementById('btn-download-qr-poster');
  const btnModalDownloadPoster = document.getElementById('btn-modal-download-poster');

  if (btnDownloadQrPoster) {
    btnDownloadQrPoster.addEventListener('click', downloadQrPoster);
  }
  if (btnModalDownloadPoster) {
    btnModalDownloadPoster.addEventListener('click', downloadQrPoster);
  }
})();
