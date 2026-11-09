/**
 * RĂNG ĐEN MÔI ĐỎ — Interactive Magazine & QR Exhibition Logic
 */

(function () {
  'use strict';

  const PUBLIC_GITHUB_PAGES_URL = 'https://ducthanh582.github.io/rang-den-moi-do';

  function getDefaultMobileQrUrl() {
    return `${PUBLIC_GITHUB_PAGES_URL}/?view=mobile`;
  }

  let currentQrUrl = getDefaultMobileQrUrl();

  /* ========================================================================
     1. VIEW MODE SWITCHING (WEB MAGAZINE <-> MOBILE ZINE & QR)
     ======================================================================== */
  const bodyEl = document.body;
  const btnModeWeb = document.getElementById('btn-mode-web');
  const btnModeMobile = document.getElementById('btn-mode-mobile');
  const btnHeroSwitchMobile = document.getElementById('btn-hero-switch-mobile');
  const btnModalGoMobile = document.getElementById('btn-modal-go-mobile');

  function setViewMode(mode) {
    const normalized = mode === 'mobile' ? 'mobile' : 'web';
    bodyEl.setAttribute('data-view-mode', normalized);

    if (btnModeWeb && btnModeMobile) {
      btnModeWeb.classList.toggle('active', normalized === 'web');
      btnModeWeb.setAttribute('aria-selected', String(normalized === 'web'));
      btnModeMobile.classList.toggle('active', normalized === 'mobile');
      btnModeMobile.setAttribute('aria-selected', String(normalized === 'mobile'));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnModeWeb) {
    btnModeWeb.addEventListener('click', () => setViewMode('web'));
  }
  if (btnModeMobile) {
    btnModeMobile.addEventListener('click', () => setViewMode('mobile'));
  }
  if (btnHeroSwitchMobile) {
    btnHeroSwitchMobile.addEventListener('click', () => setViewMode('mobile'));
  }
  if (btnModalGoMobile) {
    btnModalGoMobile.addEventListener('click', () => {
      closeQrModal();
      setViewMode('mobile');
    });
  }

  // Auto-open Mobile Zine view if visited with ?view=mobile (e.g. from scanning QR)
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'mobile') {
    setViewMode('mobile');
  }

  /* ========================================================================
     2. MOBILE ZINE BOTTOM NAVIGATION
     ======================================================================== */
  const phoneScrollContainer = document.getElementById('phone-scroll-container');
  const mobileNavButtons = document.querySelectorAll('.m-nav-item');

  mobileNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileNavButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl && phoneScrollContainer) {
        phoneScrollContainer.scrollTo({
          top: targetEl.offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ========================================================================
     3. INTERACTIVE 4-STAGE TOOTH DYEING SIMULATOR
     ======================================================================== */
  const STAGES = {
    1: {
      code: 'GIAI ĐOẠN 01 / 04',
      title: 'Cà Răng & Khử Men Ngà',
      desc: 'Chà sạch răng bằng vỏ cau khô và muối, ngậm nước cốt chanh hoặc giấm thanh để mở bề mặt men ngà, chuẩn bị đón lớp thuốc nhuộm.',
      filter: 'brightness(1.32) sepia(0.38) contrast(0.92)',
    },
    2: {
      code: 'GIAI ĐOẠN 02 / 04',
      title: 'Vào Cánh Kiến Đỏ (Nền Đỏ Tía)',
      desc: 'Đắp hỗn hợp nhựa cánh kiến đỏ cô đặc cùng vỏ lựu và cốt chanh mỗi đêm. Hàm răng chuyển dần sang sắc đỏ thẫm ấm áp.',
      filter: 'sepia(0.88) hue-rotate(-42deg) saturate(2.5) brightness(0.86)',
    },
    3: {
      code: 'GIAI ĐOẠN 03 / 04',
      title: 'Vào Phèn Đen & Ngũ Bội Tử',
      desc: 'Muối sắt trong phèn đen kết hợp với tannin tạo phản ứng hóa học tự nhiên, biến lớp nền cánh kiến đỏ sang sắc đen trầm.',
      filter: 'contrast(1.22) brightness(0.72) saturate(0.65)',
    },
    4: {
      code: 'GIAI ĐOẠN 04 / 04',
      title: 'Đen Nhánh Hạt Huyền (Hoàn Mỹ)',
      desc: 'Lớp nhựa gáo dừa đốt trên lưỡi dao sắt khóa chặt bề mặt, tạo độ bóng sâu như hạt na, hạt huyền kiêu sa bên đôi môi đỏ trầu.',
      filter: 'none',
    },
  };

  const simSlider = document.getElementById('sim-range-slider');
  const simToothImg = document.getElementById('sim-tooth-img');
  const simStageCode = document.getElementById('sim-stage-code');
  const simStageTitle = document.getElementById('sim-stage-title');
  const simStageDesc = document.getElementById('sim-stage-desc');
  const simStepButtons = document.querySelectorAll('.sim-step-btn');

  function updateSimulatorStage(stepValue) {
    const step = Number(stepValue) || 4;
    const data = STAGES[step] || STAGES[4];

    if (simSlider) simSlider.value = String(step);
    if (simToothImg) simToothImg.style.filter = data.filter;
    if (simStageCode) simStageCode.textContent = data.code;
    if (simStageTitle) simStageTitle.textContent = data.title;
    if (simStageDesc) simStageDesc.textContent = data.desc;

    simStepButtons.forEach((btn) => {
      const btnStep = Number(btn.getAttribute('data-step'));
      btn.classList.toggle('active', btnStep === step);
    });
  }

  if (simSlider) {
    simSlider.addEventListener('input', (e) => {
      updateSimulatorStage(e.target.value);
    });
  }

  simStepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      updateSimulatorStage(btn.getAttribute('data-step'));
    });
  });

  /* ========================================================================
     4. QR CODE GENERATION & EXHIBITION POSTER EXPORT
     ======================================================================== */
  const qrHeroBox = document.getElementById('qr-hero-box');
  const qrCompanionBox = document.getElementById('qr-companion-box');
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
        colorDark: '#071619',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } else {
      // Fallback API image if CDN blocked
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=071619&bgcolor=ffffff&data=${encodeURIComponent(text)}`;
      img.alt = 'QR Code Răng Đen Môi Đỏ';
      container.appendChild(img);
    }
  }

  function renderAllQrCodes(url) {
    currentQrUrl = (url || '').trim() || getDefaultMobileQrUrl();
    if (qrUrlInput) qrUrlInput.value = currentQrUrl;
    if (qrModalUrlInput) qrModalUrlInput.value = currentQrUrl;

    renderSingleQr(qrHeroBox, currentQrUrl, 128);
    renderSingleQr(qrCompanionBox, currentQrUrl, 220);
    renderSingleQr(qrModalBox, currentQrUrl, 220);
  }

  // Initial render
  renderAllQrCodes(currentQrUrl);

  const btnUpdateQr = document.getElementById('btn-update-qr');
  const btnModalUpdateQr = document.getElementById('btn-modal-update-qr');
  const btnResetLanUrl = document.getElementById('btn-reset-lan-url');

  if (btnUpdateQr && qrUrlInput) {
    btnUpdateQr.addEventListener('click', () => {
      renderAllQrCodes(qrUrlInput.value);
    });
  }

  if (btnModalUpdateQr && qrModalUrlInput) {
    btnModalUpdateQr.addEventListener('click', () => {
      renderAllQrCodes(qrModalUrlInput.value);
    });
  }

  if (btnResetLanUrl) {
    btnResetLanUrl.addEventListener('click', () => {
      renderAllQrCodes(getDefaultMobileQrUrl());
    });
  }

  /* ========================================================================
     5. QR EXHIBITION MODAL
     ======================================================================== */
  const qrModal = document.getElementById('qr-modal');
  const btnOpenQrModal = document.getElementById('btn-open-qr-modal');
  const btnHeroOpenQr = document.getElementById('btn-hero-open-qr');
  const btnCardOpenQr = document.getElementById('btn-card-open-qr');
  const btnCloseQrModal = document.getElementById('btn-close-qr-modal');

  function openQrModal() {
    if (qrModal) qrModal.classList.add('open');
  }

  function closeQrModal() {
    if (qrModal) qrModal.classList.remove('open');
  }

  [btnOpenQrModal, btnHeroOpenQr, btnCardOpenQr].forEach((btn) => {
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
     6. DOWNLOAD ARTISTIC QR POSTER CARD (.PNG)
     ======================================================================== */
  function downloadQrPoster() {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1260;
    const ctx = canvas.getContext('2d');

    // 1. Deep Teal Obsidian Background
    const bgGrad = ctx.createLinearGradient(0, 0, 900, 1260);
    bgGrad.addColorStop(0, '#0b252b');
    bgGrad.addColorStop(0.5, '#133b44');
    bgGrad.addColorStop(1, '#071619');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 1260);

    // 2. Diamond Ceramic Tile Grid Pattern (Magenta Grout Lines)
    ctx.strokeStyle = 'rgba(216, 59, 124, 0.28)';
    ctx.lineWidth = 2;
    const step = 90;
    for (let i = -1260; i < 1800; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 1260, 1260);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i + 1260, 0);
      ctx.lineTo(i, 1260);
      ctx.stroke();
    }

    // 3. Ornamental Gold & Magenta Frame
    ctx.strokeStyle = '#d8b568';
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, 816, 1176);

    ctx.strokeStyle = 'rgba(216, 59, 124, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(56, 56, 788, 1148);

    // 4. Header Metadata
    ctx.fillStyle = '#d8b568';
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ẤN PHẨM TẠP CHÍ SỐ NGHỆ THUẬT // ART ZINE ✦', 450, 125);

    // 5. Title "Răng đen Môi đỏ"
    ctx.fillStyle = '#efedf6';
    ctx.font = 'italic 92px "Pinyon Script", "Cormorant Garamond", serif';
    ctx.fillText('Răng đen Môi đỏ', 450, 235);

    ctx.fillStyle = '#f25a99';
    ctx.font = '600 24px "Cormorant Garamond", serif';
    ctx.fillText('MỸ HỌC HẠT HUYỀN & PHONG TỤC CỔ TRUYỀN VIỆT NAM', 450, 285);

    // 6. White QR Mount Box
    const qrBoxSize = 440;
    const qrBoxX = (900 - qrBoxSize) / 2;
    const qrBoxY = 340;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
    ctx.fill();

    // Draw existing QR canvas or image inside the mount box
    const sourceCanvas =
      (qrCompanionBox && qrCompanionBox.querySelector('canvas')) ||
      (qrModalBox && qrModalBox.querySelector('canvas')) ||
      (qrHeroBox && qrHeroBox.querySelector('canvas'));

    if (sourceCanvas) {
      ctx.drawImage(sourceCanvas, qrBoxX + 36, qrBoxY + 36, qrBoxSize - 72, qrBoxSize - 72);
    }

    // 7. Poetry & Instructions
    ctx.fillStyle = '#efedf6';
    ctx.font = 'italic 30px "Cormorant Garamond", serif';
    ctx.fillText('“Năm quan mua lấy miệng cười', 450, 860);
    ctx.fillText('Mười quan chẳng tiếc, tiếc người răng đen”', 450, 902);

    ctx.fillStyle = '#d8b568';
    ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('QUÉT MÃ QR ĐỂ ĐỌC TẠP CHÍ TRÊN ĐIỆN THOẠI', 450, 995);

    ctx.fillStyle = '#c8c4dc';
    ctx.font = '18px "Space Mono", monospace';
    ctx.fillText(currentQrUrl, 450, 1045);

    ctx.fillStyle = 'rgba(200, 196, 220, 0.55)';
    ctx.font = '16px "Space Mono", monospace';
    ctx.fillText('CONCEPT & COLOR PALETTE INSPIRED BY @NENENETH HANDFAN ARTWORK', 450, 1155);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'The-QR-Rang-Den-Moi-Do.png';
    link.href = dataUrl;
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
