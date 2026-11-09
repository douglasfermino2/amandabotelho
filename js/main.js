document.addEventListener('DOMContentLoaded', () => {
  // 0. Analytics Helper (Google Analytics 4 + Google Tag Manager / Google Ads)
  function trackEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: eventName, ...params });
      }
    } catch (_) {
      // Ignore tracking errors to never block UI
    }
  }

  // 1. Sticky Navbar & Scroll Spy
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Toggle (with ARIA expanded state)
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. Treatment Filter Tabs (with WAI-ARIA tab selection & arrow keys)
  const filterTabs = document.querySelectorAll('.filter-tab');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  function activateFilterTab(tab) {
    filterTabs.forEach(t => {
      const isSelected = t === tab;
      t.classList.toggle('active', isSelected);
      t.setAttribute('aria-selected', String(isSelected));
    });

    const filterValue = tab.getAttribute('data-filter');
    trackEvent('filter_treatment', {
      category_code: filterValue || 'all',
      category_label: (tab.textContent || '').trim()
    });

    treatmentCards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(/\s+/);
      if (filterValue === 'all' || categories.includes(filterValue)) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  filterTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activateFilterTab(tab));
    tab.addEventListener('keydown', (e) => {
      const dirs = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in dirs) {
        e.preventDefault();
        const nextIdx = (idx + dirs[e.key] + filterTabs.length) % filterTabs.length;
        filterTabs[nextIdx].focus();
        activateFilterTab(filterTabs[nextIdx]);
      }
    });
  });

  // 3. Facial Anatomical Zones Interactive Tabs (Static HTML Panels for SEO/GEO/AEO + WAI-ARIA tablist)
  const zoneBtns = document.querySelectorAll('.zone-btn');
  const zonePanels = document.querySelectorAll('.zone-display-card[data-zone-panel]');

  function activateZone(btn) {
    const zoneKey = btn.getAttribute('data-zone');
    const zoneTitle = btn.querySelector('h4')?.textContent?.trim() || zoneKey;
    trackEvent('facial_zone_select', {
      zone_id: zoneKey,
      zone_name: zoneTitle
    });

    zoneBtns.forEach(b => {
      const isSelected = b === btn;
      b.classList.toggle('active', isSelected);
      b.setAttribute('aria-selected', String(isSelected));
      b.tabIndex = isSelected ? 0 : -1;
    });

    zonePanels.forEach(panel => {
      const isMatch = panel.getAttribute('data-zone-panel') === zoneKey;
      panel.hidden = !isMatch;
    });
  }

  zoneBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => activateZone(btn));
    btn.addEventListener('keydown', (e) => {
      const dirs = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in dirs) {
        e.preventDefault();
        const nextIdx = (idx + dirs[e.key] + zoneBtns.length) % zoneBtns.length;
        zoneBtns[nextIdx].focus();
        activateZone(zoneBtns[nextIdx]);
      }
    });
  });

  // 4. Interactive Protocol Quiz
  const quizState = {
    step: 1,
    queixa: 'Lipo de Papada e Contorno Mandibular',
    resultado: 'Naturalidade e Elegância Sutil',
    prazo: 'O mais breve possível (Esta semana / Próxima)'
  };

  const quizSteps = document.querySelectorAll('.quiz-step');
  const nextBtns = document.querySelectorAll('.btn-quiz-next');
  const prevBtns = document.querySelectorAll('.btn-quiz-prev');
  const btnQuizWhatsapp = document.getElementById('btnQuizWhatsapp');

  function updateQuizDisplay() {
    quizSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.getAttribute('data-step')) === quizState.step) {
        step.classList.add('active');
      }
    });

    if (quizState.step === 4) {
      document.getElementById('summaryQueixa').textContent = quizState.queixa;
      document.getElementById('summaryResultado').textContent = quizState.resultado;
      document.getElementById('summaryPrazo').textContent = quizState.prazo;

      const baseText = `Olá, Dra. Amanda Botelho! Preenchi o simulador no site e gostaria de uma avaliação personalizada em Alphaville.\n\n✨ Área de interesse: ${quizState.queixa}\n💎 Perfil desejado: ${quizState.resultado}\n📅 Previsão: ${quizState.prazo}\n\nGostaria de agendar uma consulta para conversarmos.`;
      const encodedMsg = encodeURIComponent(baseText);
      btnQuizWhatsapp.href = `https://wa.me/5511999901831?text=${encodedMsg}`;

      trackEvent('quiz_complete', {
        queixa: quizState.queixa,
        resultado: quizState.resultado,
        prazo: quizState.prazo
      });
    }
  }

  // Quiz Option Selection
  document.querySelectorAll('.quiz-option-btn').forEach(option => {
    option.addEventListener('click', () => {
      const parentStep = option.closest('.quiz-step');
      parentStep.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });
      option.classList.add('selected');
      option.setAttribute('aria-pressed', 'true');

      const stepNum = parseInt(parentStep.getAttribute('data-step'));
      const val = option.getAttribute('data-val');

      if (stepNum === 1) quizState.queixa = val;
      if (stepNum === 2) quizState.resultado = val;
      if (stepNum === 3) quizState.prazo = val;

      trackEvent('quiz_option_select', {
        step_number: stepNum,
        selected_value: val
      });
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizState.step < 4) {
        quizState.step++;
        trackEvent('quiz_step_view', { step_number: quizState.step });
        updateQuizDisplay();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizState.step > 1) {
        quizState.step--;
        updateQuizDisplay();
      }
    });
  });

  // 5. FAQ Accordion (with aria-expanded)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        const qText = question.querySelector('span')?.textContent?.trim() || 'FAQ';
        trackEvent('faq_open', { question_text: qText });
      }
    });
  });

  // 6. Direct WhatsApp Lead Handlers on Procedure Buttons
  document.querySelectorAll('.btn-lead-procedure').forEach(btn => {
    btn.addEventListener('click', () => {
      const procedureName = btn.getAttribute('data-procedure') || 'Harmonização Facial';
      const text = `Olá, Dra. Amanda! Gostaria de agendar uma avaliação e tirar dúvidas sobre o procedimento de *${procedureName}* em seu consultório em Alphaville.`;
      btn.href = `https://wa.me/5511999901831?text=${encodeURIComponent(text)}`;
    });
  });

  // 6.1 Global Conversion & Interaction Tracking (WhatsApp, Maps, Instagram, Comparison Table & Section Views)
  document.querySelectorAll('a[href*="wa.me"], .btn-lead-procedure, #btnQuizWhatsapp').forEach(link => {
    link.addEventListener('click', () => {
      let locationLabel = 'Site Geral';
      let procedureInterest = link.getAttribute('data-procedure') || 'Avaliação Geral';

      if (link.classList.contains('nav-cta-btn')) {
        locationLabel = 'Menu Topo';
      } else if (link.classList.contains('floating-whatsapp-btn')) {
        locationLabel = 'Botão Flutuante WhatsApp';
      } else if (link.id === 'btnQuizWhatsapp') {
        locationLabel = 'Resultado do Simulador';
        procedureInterest = quizState.queixa;
      } else if (link.classList.contains('btn-lead-procedure')) {
        locationLabel = 'Card de Procedimento';
      } else if (link.closest('#inicio')) {
        locationLabel = 'Hero Principal';
      } else if (link.closest('#zonas-faciais')) {
        locationLabel = 'Guia Anatômico Facial';
        procedureInterest = link.closest('.zone-display-card')?.querySelector('.zone-title-main')?.textContent?.trim() || 'Região Facial';
      } else if (link.closest('#sobre')) {
        locationLabel = 'Seção Sobre a Dra.';
      } else if (link.closest('#clinica')) {
        locationLabel = 'Seção Clínica Alphaville';
      } else if (link.closest('.cta-vip-section')) {
        locationLabel = 'Banner VIP Final';
      } else if (link.closest('.footer')) {
        locationLabel = 'Rodapé';
      }

      const eventPayload = {
        button_location: locationLabel,
        procedure_interest: procedureInterest
      };

      trackEvent('whatsapp_click', eventPayload);
      trackEvent('generate_lead', {
        event_category: 'WhatsApp',
        event_label: `${locationLabel} - ${procedureInterest}`,
        ...eventPayload
      });
      // Google Ads "Clique no WhatsApp" official conversion action
      trackEvent('conversion', {
        send_to: 'AW-18564028677/vmiKCNXllbUdEIWygpRF'
      });
    });
  });

  // Track Google Maps & Instagram clicks
  document.querySelectorAll('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"]').forEach(mapLink => {
    mapLink.addEventListener('click', () => {
      const loc = mapLink.closest('.footer') ? 'Rodapé' : 'Seção Clínica';
      trackEvent('maps_click', { button_location: loc });
    });
  });

  document.querySelectorAll('a[href*="instagram.com"]').forEach(igLink => {
    igLink.addEventListener('click', () => {
      let loc = 'Site';
      if (igLink.closest('#sobre')) loc = 'Seção Sobre a Dra.';
      else if (igLink.closest('.cta-vip-section')) loc = 'Banner VIP Final';
      else if (igLink.closest('.footer')) loc = 'Rodapé';
      trackEvent('instagram_click', { button_location: loc });
    });
  });

  // Track Comparison Table Toggle
  const comparisonDetails = document.querySelector('.comparison-table-wrapper');
  if (comparisonDetails) {
    comparisonDetails.addEventListener('toggle', () => {
      if (comparisonDetails.open) {
        trackEvent('comparison_table_open', { section: 'procedimentos' });
      }
    });
  }

  // Track Section Visibility (which sections visitors actually stop to read vs skip)
  if ('IntersectionObserver' in window) {
    const seenSections = new Set();
    const sectionTimers = new Map();
    const trackedSections = document.querySelectorAll('section[id], .pillars-section, .testimonials-section, .cta-vip-section');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const sectionKey = el.id || el.className.split(' ')[0];
        if (seenSections.has(sectionKey)) return;

        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            seenSections.add(sectionKey);
            trackEvent('section_view', { section_name: sectionKey });
            sectionObserver.unobserve(el);
          }, 1500);
          sectionTimers.set(sectionKey, timer);
        } else if (sectionTimers.has(sectionKey)) {
          clearTimeout(sectionTimers.get(sectionKey));
          sectionTimers.delete(sectionKey);
        }
      });
    }, { threshold: 0.35 });

    trackedSections.forEach(sec => sectionObserver.observe(sec));
  }

  // 7. Subtle Hero Portrait Parallax (disabled when prefers-reduced-motion is active)
  const hero = document.getElementById('inicio');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches) {
    let rafId = null;
    hero.addEventListener('pointermove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty('--mx', mx.toFixed(3));
        hero.style.setProperty('--my', my.toFixed(3));
        rafId = null;
      });
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
    });
  }
});
