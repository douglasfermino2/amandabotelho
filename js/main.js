document.addEventListener('DOMContentLoaded', () => {
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

  // 3. Facial Anatomical Zones Interactive Data (with WAI-ARIA tablist & arrow keys)
  const zoneData = {
    superior: {
      title: "Terço Superior Facial",
      tag: "Olhar & Testa",
      desc: "Região correspondente à fronte (testa), glabela (entre as sobrancelhas) e área periorbital. O foco é suavizar linhas de expressão mímicas sem congelar o rosto, promovendo um arqueamento gracioso e olhar descansado.",
      benefits: [
        "Suavização de rugas na testa e pés de galinha",
        "Elevação e arqueamento sutil de sobrancelhas",
        "Tratamento preventivo de linhas estáticas",
        "Aparência serena, jovem e descansada"
      ],
      procedures: "Toxina Botulínica (Botox) • Skinbooster • Fios de Estímulo"
    },
    medio: {
      title: "Terço Médio Facial",
      tag: "Malar & Olheiras",
      desc: "Área de projeção das maçãs do rosto (zigomático), olheiras e fossa canina. A estruturação desta zona é o segredo do efeito 'Top Model Look' e sustentação de todo o rosto, prevenindo a queda tecidual.",
      benefits: [
        "Reposição do volume malar e sustentação",
        "Atenuação de olheiras profundas e cansaço",
        "Efeito 'Lifting' imediato na face média",
        "Contorno jovial e luminoso dos traços"
      ],
      procedures: "Preenchimento com Ácido Hialurônico (MD Codes) • Bioestimuladores • Fios de Tração"
    },
    inferior: {
      title: "Terço Inferior & Cervical",
      tag: "Papada, Mandíbula & Lábios",
      desc: "Compreende a linha da mandíbula, mento (queixo), lábios e a região submentoniana (papada). É onde alcançamos a maior definição de contorno e harmonia no perfil facial com a Lipo de Papada HD e escultura labial.",
      benefits: [
        "Eliminação definitiva do excesso de papada",
        "Definição nítida da linha da mandíbula e queixo",
        "Escultura e hidratação labial proporcional",
        "Melhoria marcante do perfil facial e jovialidade"
      ],
      procedures: "Lipoaspiração Mecânica de Papada • Preenchimento Labial/Mento • Bioestimulador de Pescoço"
    },
    sorriso: {
      title: "Odontologia, Prótese 12h & Cirurgia Oral",
      tag: "Estética, Reabilitação & Siso",
      desc: "Cuidado odontológico completo aliando estética, cirurgia oral segura e reabilitação rápida. Da Prótese Total confeccionada e entregue em menos de 12 horas (tudo em 1 dia) à Cirurgia de Siso humanizada, Clínico Geral e Lentes de Porcelana.",
      benefits: [
        "Prótese Total em 1 Dia: entrega expressa em menos de 12 horas",
        "Cirurgia de Siso segura sob anestesia local e pós-operatório assistido",
        "Clínico Geral completo: check-up, profilaxia (limpeza) e restaurações",
        "Lentes de Contato em Porcelana, Clareamento e Sorriso Gengival"
      ],
      procedures: "Prótese Total (< 12h) • Cirurgia de Siso • Clínico Geral • Lentes em Porcelana & Clareamento"
    }
  };

  const zoneBtns = document.querySelectorAll('.zone-btn');
  const zoneDisplayCard = document.getElementById('zoneDisplayCard');
  const zoneTitleMain = document.getElementById('zoneTitleMain');
  const zoneBadgeTag = document.getElementById('zoneBadgeTag');
  const zoneDescription = document.getElementById('zoneDescription');
  const zoneBenefitsList = document.getElementById('zoneBenefitsList');
  const zoneProcedures = document.getElementById('zoneProcedures');
  const zoneWhatsappBtn = document.getElementById('zoneWhatsappBtn');

  function activateZone(btn) {
    zoneBtns.forEach(b => {
      const isSelected = b === btn;
      b.classList.toggle('active', isSelected);
      b.setAttribute('aria-selected', String(isSelected));
      b.tabIndex = isSelected ? 0 : -1;
    });

    if (zoneDisplayCard && btn.id) {
      zoneDisplayCard.setAttribute('aria-labelledby', btn.id);
    }

    const zoneKey = btn.getAttribute('data-zone');
    const data = zoneData[zoneKey];

    if (data && zoneTitleMain) {
      zoneTitleMain.textContent = data.title;
      zoneBadgeTag.textContent = data.tag;
      zoneDescription.textContent = data.desc;
      zoneProcedures.textContent = data.procedures;

      if (zoneWhatsappBtn) {
        const msg = encodeURIComponent(`Olá, Dra. Amanda! Gostaria de avaliar especificamente a região do ${data.title}.`);
        zoneWhatsappBtn.href = `https://wa.me/5511999901831?text=${msg}`;
      }

      zoneBenefitsList.innerHTML = '';
      data.benefits.forEach(b => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${b}`;
        zoneBenefitsList.appendChild(li);
      });
    }
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
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizState.step < 4) {
        quizState.step++;
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
