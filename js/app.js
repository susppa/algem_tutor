/**
 * Алгем — Интерактивное приложение курса
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeTab: 'theory',   // 'theory' | 'practice' | 'exam' | 'colloquium'
    currentView: 'modules', // 'modules' | 'topic' | 'exam' | 'colloquium'
    activeModuleId: null,
    activeTopicId: null,
    searchQuery: '',
    returnTab: null,
    activeColloqBlock: 'all',
    colloqMode: 'single', // 'single' | 'all' (Single Ticket mode solves scrolling fatigue!)
    activeColloqTicketId: 'ticket-1',
    activeExamLevel: 'medium', // 'basic' | 'medium' | 'hard'
    activeExamVariantId: 'variant-2',
    generatedVariant: null,
    examTimerSeconds: 90 * 60,
    examTimerInterval: null,
    examTimerRunning: false
  };

  // DOM Elements
  const catalogView = document.getElementById('catalogView');
  const topicView = document.getElementById('topicView');
  const examView = document.getElementById('examView');
  const colloquiumView = document.getElementById('colloquiumView');
  const modulesGrid = document.getElementById('modulesGrid');
  const sidebarContent = document.getElementById('sidebarContent');
  const topicReader = document.getElementById('topicReader');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchDropdown = document.getElementById('searchDropdown');
  const sidebarBackBtn = document.getElementById('sidebarBackBtn');
  const brandLink = document.getElementById('brandLink');
  const footerBackLink = document.getElementById('footerBackLink');
  const footerTopLink = document.getElementById('footerTopLink');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const catalogHeading = document.getElementById('catalogHeading');
  const catalogSubheading = document.getElementById('catalogSubheading');
  const catalogStats = document.getElementById('catalogStats');

  // Initialize
  init();

  function init() {
    setupEventListeners();
    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
  }

  // Event Listeners
  function setupEventListeners() {
    // Brand link returns to modules view
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearSearch();
      window.location.hash = `#${state.activeTab}`;
    });

    if (footerTopLink) {
      footerTopLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (footerBackLink) {
      footerBackLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearSearch();
        if (state.returnTab === 'exam' || state.returnTab === 'colloquium') {
          const ret = state.returnTab;
          state.returnTab = null;
          window.location.hash = `#${ret}`;
        } else {
          window.location.hash = `#${state.activeTab}`;
        }
      });
    }

    // Sidebar back button
    sidebarBackBtn.addEventListener('click', () => {
      clearSearch();
      if (state.returnTab === 'exam' || state.returnTab === 'colloquium') {
        const ret = state.returnTab;
        state.returnTab = null;
        window.location.hash = `#${ret}`;
      } else {
        window.location.hash = `#${state.activeTab}`;
      }
    });

    // Navigation Tabs (Теория vs Практика vs Контрольная vs Коллоквиум)
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.dataset.tab;
        
        clearSearch();
        state.returnTab = null;
        if (state.activeTab === 'exam') {
          showExamView();
          window.location.hash = '#exam';
        } else if (state.activeTab === 'colloquium') {
          showColloquiumView();
          window.location.hash = '#colloquium';
        } else {
          showModulesView();
          renderModules();
          window.location.hash = `#${state.activeTab}`;
        }
      });
    });

    // Clear Search Button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        clearSearch();
        if (state.activeTab === 'exam') {
          showExamView();
        } else if (state.activeTab === 'colloquium') {
          showColloquiumView();
        } else if (state.currentView === 'modules') {
          renderModules();
        }
      });
    }

    // Close Dropdown on Outside Click
    document.addEventListener('click', (e) => {
      if (searchDropdown && !searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.style.display = 'none';
      }
    });

    // Search Input with Instant Dropdown & Fast Search
    let searchTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      const val = e.target.value.trim();
      state.searchQuery = val.toLowerCase();

      if (searchClearBtn) {
        searchClearBtn.style.display = val ? 'block' : 'none';
      }

      searchTimer = setTimeout(() => {
        renderSearchDropdown();
        if (state.searchQuery) {
          showModulesView();
          renderModules();
        } else {
          if (searchDropdown) searchDropdown.style.display = 'none';
          if (state.activeTab === 'exam') {
            showExamView();
          } else if (state.activeTab === 'colloquium') {
            showColloquiumView();
          } else {
            renderModules();
          }
        }
      }, 120);
    });

    // Enter Key on Search Input
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (searchDropdown) searchDropdown.style.display = 'none';
      } else if (e.key === 'Enter') {
        if (searchDropdown) searchDropdown.style.display = 'none';
        const items = getTabItems();
        if (items.length > 0) {
          window.location.hash = `#topic-${items[0].id}`;
        }
      }
    });
  }

  function clearSearch() {
    state.searchQuery = '';
    searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    if (searchDropdown) searchDropdown.style.display = 'none';
  }

  // Live Instant Search Dropdown
  function renderSearchDropdown() {
    if (!searchDropdown) return;
    const q = state.searchQuery;
    if (!q || q.length < 2) {
      searchDropdown.style.display = 'none';
      return;
    }

    // Search across ALL course items regardless of active tab
    const matches = COURSE_DATA.items.filter(item => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      const inTopic = item.topic.toLowerCase().includes(q);
      let inSections = false;
      for (const sec in item.sections) {
        if (item.sections[sec].toLowerCase().includes(q)) {
          inSections = true;
          break;
        }
      }
      return inTitle || inKeywords || inTopic || inSections;
    }).slice(0, 6);

    // Also search across exam tasks if EXAM_DATA exists
    const examMatches = [];
    const examTasks = (typeof EXAM_DATA !== 'undefined' && EXAM_DATA.tasks) ? EXAM_DATA.tasks : (typeof window !== 'undefined' && window.EXAM_DATA ? window.EXAM_DATA.tasks : null);
    if (examTasks) {
      examTasks.forEach(t => {
        if (
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.topic.toLowerCase().includes(q) ||
          (t.num + '').includes(q) ||
          'контрольная'.includes(q)
        ) {
          examMatches.push(t);
        }
      });
    }

    // Also search across colloquium tickets if COLLOQUIUM_DATA exists
    const colloqMatches = [];
    const colloqTickets = (typeof COLLOQUIUM_DATA !== 'undefined' && COLLOQUIUM_DATA.tickets) ? COLLOQUIUM_DATA.tickets : (typeof window !== 'undefined' && window.COLLOQUIUM_DATA ? window.COLLOQUIUM_DATA.tickets : null);
    if (colloqTickets) {
      colloqTickets.forEach(t => {
        if (
          t.title.toLowerCase().includes(q) ||
          (t.num + '').includes(q) ||
          t.blockTitle.toLowerCase().includes(q) ||
          t.questions.some(qn => qn.toLowerCase().includes(q)) ||
          'коллоквиум'.includes(q)
        ) {
          colloqMatches.push(t);
        }
      });
    }

    if (matches.length === 0 && examMatches.length === 0 && colloqMatches.length === 0) {
      searchDropdown.innerHTML = `<div class="search-dropdown-empty">Ничего не найдено по запросу «${q}»</div>`;
      searchDropdown.style.display = 'block';
      return;
    }

    let html = '';
    if (colloqMatches.length > 0) {
      html += colloqMatches.slice(0, 3).map(t => `
        <a href="#${t.id}" class="search-dropdown-item colloq-match">
          <span class="item-title">🎓 Билет №${t.num} — ${t.title}</span>
          <span class="search-type-badge colloq" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd;">Коллоквиум • ${t.blockTitle.split(':')[0]}</span>
        </a>
      `).join('');
    }

    if (examMatches.length > 0) {
      html += examMatches.map(t => `
        <a href="#${t.id}" class="search-dropdown-item exam-match">
          <span class="item-title">🔥 ${t.code} — ${t.title}</span>
          <span class="search-type-badge exam">Контрольная • Задание ${t.num}</span>
        </a>
      `).join('');
    }

    html += matches.map(item => {
      const mod = COURSE_DATA.modules.find(m => m.id === item.moduleId) || {};
      const typeLabel = item.type === 'practice' ? 'Практика' : 'Теория';
      return `
        <a href="#topic-${item.id}" class="search-dropdown-item" data-id="${item.id}">
          <span class="item-title">${item.title}</span>
          <span class="search-type-badge ${item.type}">${typeLabel} • Модуль ${mod.num || ''}</span>
        </a>
      `;
    }).join('');

    searchDropdown.innerHTML = html;

    searchDropdown.querySelectorAll('.search-dropdown-item').forEach(el => {
      el.addEventListener('click', () => {
        searchDropdown.style.display = 'none';
        clearSearch();
      });
    });

    searchDropdown.style.display = 'block';
  }

  // Hash-based Routing
  function handleHashRouting() {
    const hash = window.location.hash.replace('#', '');
    
    if (hash === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!hash || hash === 'theory') {
      setActiveTab('theory');
      showModulesView();
      renderModules();
    } else if (hash === 'practice') {
      setActiveTab('practice');
      showModulesView();
      renderModules();
    } else if (hash === 'exam' || hash.startsWith('task-') || hash.startsWith('prob-') || hash.startsWith('algo-')) {
      setActiveTab('exam');
      showExamView(hash);
    } else if (hash === 'colloquium' || hash.startsWith('ticket-')) {
      setActiveTab('colloquium');
      showColloquiumView(hash);
    } else if (hash.startsWith('topic-')) {
      const topicId = hash.replace('topic-', '');
      showTopicView(topicId);
    } else {
      showModulesView();
      renderModules();
    }
  }

  function setActiveTab(tab) {
    state.activeTab = tab;
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
  }

  // Switch View to Modules Grid
  function showModulesView() {
    state.currentView = 'modules';
    state.returnTab = null;
    if (sidebarBackBtn) sidebarBackBtn.textContent = '← Ко всем темам';
    if (footerBackLink) footerBackLink.textContent = 'К списку модулей';
    catalogView.style.display = 'block';
    topicView.style.display = 'none';
    if (examView) examView.style.display = 'none';
    if (colloquiumView) colloquiumView.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch View to Topic Detail
  function showTopicView(topicId) {
    const item = COURSE_DATA.items.find(i => i.id === topicId);
    if (!item) {
      showModulesView();
      return;
    }

    // If navigated from exam or colloquium view, save context
    if (state.activeTab === 'exam' || state.currentView === 'exam') {
      state.returnTab = 'exam';
    } else if (state.activeTab === 'colloquium' || state.currentView === 'colloquium') {
      state.returnTab = 'colloquium';
    }

    // Set tab matching the item type
    if (item.type === 'practice') {
      setActiveTab('practice');
    } else {
      setActiveTab('theory');
    }

    state.currentView = 'topic';
    state.activeTopicId = topicId;
    state.activeModuleId = item.moduleId;

    catalogView.style.display = 'none';
    topicView.style.display = 'block';
    if (examView) examView.style.display = 'none';
    if (colloquiumView) colloquiumView.style.display = 'none';

    // Update back buttons label if coming from exam or colloquium
    if (state.returnTab === 'exam') {
      sidebarBackBtn.textContent = '← Назад к контрольной 🔥';
      if (footerBackLink) footerBackLink.textContent = 'Назад к контрольной 🔥';
    } else if (state.returnTab === 'colloquium') {
      sidebarBackBtn.textContent = '← Назад к коллоквиуму 🎓';
      if (footerBackLink) footerBackLink.textContent = 'Назад к коллоквиуму 🎓';
    } else {
      sidebarBackBtn.textContent = '← Ко всем темам';
      if (footerBackLink) footerBackLink.textContent = 'К списку модулей';
    }

    renderSidebar();
    renderTopicReader(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch View to Exam Guide
  function showExamView(targetId) {
    state.currentView = 'exam';
    state.activeTab = 'exam';
    state.returnTab = null;
    setActiveTab('exam');

    if (sidebarBackBtn) sidebarBackBtn.textContent = '← Ко всем темам';
    if (footerBackLink) footerBackLink.textContent = 'К списку модулей';

    catalogView.style.display = 'none';
    topicView.style.display = 'none';
    if (colloquiumView) colloquiumView.style.display = 'none';
    if (examView) {
      examView.style.display = 'block';

      // Re-render to ensure generator and latest tasks are up to date
      if (!examView.dataset.rendered) {
        renderExamView();
        renderExamMath();
        examView.dataset.rendered = 'true';
      }

      if (targetId && (targetId.startsWith('task-') || targetId.startsWith('prob-') || targetId.startsWith('algo-') || targetId.startsWith('variant-'))) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            if (el.tagName === 'DETAILS' && !el.open) {
              el.open = true;
            }
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Generate a complete 5-task variant based on level or preset variantId
  function getExamVariant(level, variantId) {
    const d = (typeof EXAM_DATA !== 'undefined') ? EXAM_DATA : (window.EXAM_DATA || null);
    const variants = (typeof EXAM_VARIANTS !== 'undefined') ? EXAM_VARIANTS : (window.EXAM_VARIANTS || []);
    if (!d) return null;

    // Check if archive past-year variant is requested
    if (variantId && variantId.startsWith('past-var-')) {
      const pastVariants = (typeof PAST_EXAM_VARIANTS !== 'undefined') ? PAST_EXAM_VARIANTS : (window.PAST_EXAM_VARIANTS || []);
      const preset = pastVariants.find(v => v.id === variantId);
      if (preset) {
        return {
          id: preset.id,
          num: preset.num,
          title: preset.title,
          level: 'medium',
          levelName: preset.note || 'Архивный вариант прошлого года (Aⁿ, AXB=C, СЛАУ с рангами, ⁴√w, базис)',
          problems: preset.problems
        };
      }
    }

    // Check if official preset variant is requested
    if (variantId && variants.length > 0) {
      const preset = variants.find(v => v.id === variantId);
      if (preset) {
        const problems = [];
        preset.taskIds.forEach(pid => {
          for (const task of d.tasks) {
            const prob = task.problems.find(p => p.id === pid);
            if (prob) {
              problems.push({ taskNum: task.num, taskTitle: task.title, taskCode: task.code, ...prob });
              break;
            }
          }
        });
        return {
          id: preset.id,
          num: preset.num,
          title: preset.title,
          level: preset.level,
          levelName: preset.levelName,
          problems
        };
      }
    }

    // Dynamic generation by difficulty level
    const chosenLevel = level || 'medium';
    const levelLabels = {
      basic: 'Базовый уровень (разминка перед контрольной)',
      medium: 'Средний уровень (⭐ рекомендуемый: готовиться лучше по нему)',
      hard: 'Сложный уровень (для дополнительной подготовки)'
    };

    const problems = [];
    d.tasks.forEach(task => {
      // Find problem matching level or fallback to first
      let matching = task.problems.filter(p => p.difficulty === chosenLevel);
      if (matching.length === 0) matching = task.problems;
      const pick = matching[Math.floor(Math.random() * matching.length)];
      problems.push({ taskNum: task.num, taskTitle: task.title, taskCode: task.code, ...pick });
    });

    return {
      id: 'dynamic-variant-' + Date.now(),
      num: Math.floor(Math.random() * 20) + 10,
      title: 'Случайный вариант для самопроверки',
      level: chosenLevel,
      levelName: levelLabels[chosenLevel] || levelLabels.medium,
      problems
    };
  }

  // Format seconds to mm:ss
  function formatExamTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Render Full Exam View with Generator, 5 Tasks, Synopsis, Rules, and Collapsible Solutions
  function renderExamView() {
    const d = (typeof EXAM_DATA !== 'undefined') ? EXAM_DATA : (window.EXAM_DATA || null);
    if (!examView || !d) {
      console.warn('EXAM_DATA or examView not found', { examView, d });
      return;
    }

    if (!state.generatedVariant) {
      state.generatedVariant = getExamVariant(state.activeExamLevel, state.activeExamVariantId);
    }

    examView.innerHTML = `
      <!-- Exam Hero -->
      <section class="exam-hero">
        <div class="exam-hero-header">
          <div class="exam-hero-title">
            <h1>🔥 ${d.meta.title}</h1>
            <p>${d.meta.subtitle}</p>
          </div>
          <div class="exam-hero-badges">
            <span class="exam-badge exam-badge-date">📅 ${d.meta.date}</span>
            <span class="exam-badge exam-badge-time">⏱️ ${d.meta.time}</span>
            <span class="exam-badge exam-badge-count">📝 ${d.meta.tasksCount} типовых заданий</span>
          </div>
        </div>

        <div class="exam-meta-grid">
          <div class="exam-meta-box">
            <h4>📌 Формат и регламент</h4>
            <ul>
              ${d.meta.rules.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          <div class="exam-meta-box">
            <h4>🎯 Критерии строгости проверяющего</h4>
            <ul>
              ${d.meta.generalCriteria.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE EXAM GENERATOR («Решить контрольную») -->
      <section class="exam-generator-card" id="examGeneratorSection">
        <div class="exam-gen-header">
          <div class="exam-gen-title-box">
            <span class="exam-gen-icon">🎲</span>
            <div>
              <h3>Тренажер: Решить вариант контрольной работы</h3>
              <p>Сгенерируйте тренировочный вариант из 5 заданий. Решайте самостоятельно на черновике, сверяясь с таймером и подробными решениями.</p>
            </div>
          </div>
        </div>

        <!-- Level Selector -->
        <div class="exam-gen-controls">
          <div class="exam-control-group">
            <label class="exam-control-label">1. Выберите уровень сложности:</label>
            <div class="exam-level-pills" role="radiogroup" aria-label="Уровень сложности">
              <button type="button" class="exam-level-btn ${state.activeExamLevel === 'basic' ? 'active' : ''}" data-level="basic">
                🟢 Базовый (разминка)
              </button>
              <button type="button" class="exam-level-btn ${state.activeExamLevel === 'medium' ? 'active' : ''}" data-level="medium">
                🟡 Средний (⭐ готовиться лучше по нему)
              </button>
              <button type="button" class="exam-level-btn ${state.activeExamLevel === 'hard' ? 'active' : ''}" data-level="hard">
                🔴 Сложный (для доп. подготовки)
              </button>
            </div>
          </div>

          <!-- Preset Variants Selector (Official Кострикин 2026 + Past Year Archive) -->
          <div class="exam-control-group">
            <label class="exam-control-label">2. Выберите тренировочный вариант этого года (Кострикин № 8.2, 18.3, 20.11, 20.8, 22.7):</label>
            <div class="exam-preset-pills">
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'var-official-medium' || !state.activeExamVariantId ? 'active' : ''}" data-variant="var-official-medium">
                ⭐ Вариант № 1 (Средний — формат КР)
              </button>
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'var-official-basic' ? 'active' : ''}" data-variant="var-official-basic">
                🟢 Вариант № 2 (Базовый)
              </button>
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'var-official-hard' ? 'active' : ''}" data-variant="var-official-hard">
                🔴 Вариант № 3 (Сложный)
              </button>
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'random' ? 'active' : ''}" data-variant="random">
                🎲 Случайная комбинация
              </button>
            </div>
          </div>

          <!-- Archive past-year variants from photos -->
          <div class="exam-control-group">
            <label class="exam-control-label">3. Или посмотрите варианты прошлого года (Aⁿ, AXB=C, СЛАУ Гаусса, ⁴√w, базис):</label>
            <div class="exam-preset-pills">
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'past-var-2' ? 'active' : ''}" data-variant="past-var-2">
                🏛️ Прошлый год: Вариант № 2
              </button>
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'past-var-3' ? 'active' : ''}" data-variant="past-var-3">
                🏛️ Прошлый год: Вариант № 3
              </button>
              <button type="button" class="exam-preset-btn ${state.activeExamVariantId === 'past-var-4' ? 'active' : ''}" data-variant="past-var-4">
                🏛️ Прошлый год: Вариант № 4
              </button>
            </div>
          </div>
        </div>

        <!-- GENERATED VARIANT SHEET -->
        <div class="exam-variant-sheet" id="examVariantSheet">
          ${renderGeneratedVariantSheet(state.generatedVariant)}
        </div>
      </section>

      <!-- Section Separator & Heading -->
      <div class="exam-syllabus-divider" id="examTasksDirectory">
        <h2>📚 Полный каталог тем и алгоритмов (№ 1 — № 5)</h2>
        <p>Изучите пошаговые алгоритмы решения, типичные подводные камни и разборы задач каждого типа:</p>
      </div>

      <!-- Quick Jump Nav Pills -->
      <nav class="exam-nav-pills" aria-label="Быстрый переход к заданиям контрольной">
        ${d.tasks.map(t => `
          <a href="#${t.id}" class="exam-nav-pill">
            <span class="pill-num">№${t.num}</span>
            <span>${t.title}</span>
          </a>
        `).join('')}
      </nav>

      <!-- 5 Exam Task Cards -->
      <div class="exam-tasks-container">
        ${d.tasks.map(task => renderExamTaskCard(task)).join('')}
      </div>
    `;

    // Attach level buttons
    examView.querySelectorAll('.exam-level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        examView.querySelectorAll('.exam-level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeExamLevel = btn.dataset.level;
        state.activeExamVariantId = null;
        examView.querySelectorAll('.exam-preset-btn').forEach(b => b.classList.remove('active'));
        
        state.generatedVariant = getExamVariant(state.activeExamLevel, null);
        updateGeneratedVariantDOM();
      });
    });

    // Attach preset variant buttons
    examView.querySelectorAll('.exam-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        examView.querySelectorAll('.exam-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const vId = btn.dataset.variant === 'random' ? null : btn.dataset.variant;
        state.activeExamVariantId = vId;
        state.generatedVariant = getExamVariant(state.activeExamLevel, vId);
        updateGeneratedVariantDOM();
      });
    });

    // Attach event listeners inside the generated variant
    attachVariantSheetEvents();

    // Attach click events on navigation pills to scroll smoothly
    examView.querySelectorAll('.exam-nav-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const targetId = pill.getAttribute('href').replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          history.pushState(null, null, `#${targetId}`);
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Attach details toggle listener so if user opens a spoiler or algorithm, math renders cleanly
    examView.querySelectorAll('.exam-spoiler, .exam-algorithm-box').forEach(spoiler => {
      spoiler.addEventListener('toggle', () => {
        if (spoiler.open && window.renderMathInElement) {
          renderMathInElement(spoiler, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    });
  }

  // HTML of Generated Variant Sheet
  function renderGeneratedVariantSheet(v) {
    if (!v) return '<p>Вариант не сгенерирован</p>';
    const isRunning = state.examTimerRunning;
    const timeStr = formatExamTimer(state.examTimerSeconds);

    return `
      <div class="variant-sheet-header">
        <div class="variant-sheet-title">
          <h4>📝 ${v.title}</h4>
          <span class="variant-level-badge">${v.levelName}</span>
        </div>
        
        <!-- Timer Box -->
        <div class="variant-timer-card">
          <div class="timer-display-wrap">
            <span class="timer-icon">⏱️</span>
            <span class="timer-digits" id="examTimerDigits">${timeStr}</span>
          </div>
          <div class="timer-actions">
            <button type="button" class="timer-btn ${isRunning ? 'timer-btn-pause' : 'timer-btn-start'}" id="examTimerToggleBtn">
              ${isRunning ? '⏸ Пауза' : '▶ Старт (90 мин)'}
            </button>
            <button type="button" class="timer-btn timer-btn-reset" id="examTimerResetBtn" title="Сбросить таймер">
              🔄 Сброс
            </button>
          </div>
        </div>
      </div>

      <div class="variant-instructions-bar">
        <span>💡 Совет:</span> Решите задания 1–5 на листе бумаги, не подглядывая. Закончив, нажмите «Показать решение и ответ» под каждым заданием для самопроверки.
      </div>

      <!-- 5 Variant Tasks -->
      <div class="variant-problems-grid">
        ${v.problems.map((prob, idx) => `
          <div class="variant-problem-card">
            <div class="variant-problem-header">
              <span class="v-prob-num">Задание ${prob.taskNum}</span>
              <span class="v-prob-title">${prob.taskTitle}</span>
              <span class="v-prob-badge">${prob.label || 'Типовая задача'}</span>
            </div>

            <div class="variant-condition">
              <strong>Условие:</strong>
              <div>${prob.condition}</div>
            </div>

            <!-- Solution Reveal Toggle -->
            <div class="variant-sol-toggle-wrap">
              <button type="button" class="btn-reveal-solution" data-target="sol-${prob.id}">
                <span class="reveal-icon">👁️</span>
                <span class="reveal-text">Показать решение и ответ</span>
                <span class="reveal-arrow">▼</span>
              </button>
            </div>

            <div class="variant-solution-container" id="sol-${prob.id}" style="display: none;">
              <div class="variant-quick-ans">
                <strong>Краткий ответ:</strong>
                <div>${prob.quickAnswer}</div>
              </div>
              <div class="variant-full-sol">
                ${prob.fullSolution}
              </div>
              ${prob.examinerNotes ? `
                <div class="variant-examiner-tip">
                  <span>💡</span> <strong>На что обратить внимание:</strong> ${prob.examinerNotes}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="variant-footer-actions">
        <button type="button" class="btn-regen-variant" id="btnRegenVariant">
          🎲 Сгенерировать другой вариант
        </button>
        <a href="#examTasksDirectory" class="link-scroll-tasks">
          📖 Изучить алгоритмы по всем 5 темам ниже ↓
        </a>
      </div>
    `;
  }

  // Update only the variant sheet DOM without full page flicker
  function updateGeneratedVariantDOM() {
    const sheetEl = document.getElementById('examVariantSheet');
    if (!sheetEl) return;
    sheetEl.innerHTML = renderGeneratedVariantSheet(state.generatedVariant);
    attachVariantSheetEvents();
    renderExamMath();
  }

  // Attach interactive events inside variant sheet
  function attachVariantSheetEvents() {
    const toggleBtn = document.getElementById('examTimerToggleBtn');
    const resetBtn = document.getElementById('examTimerResetBtn');
    const regenBtn = document.getElementById('btnRegenVariant');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (state.examTimerRunning) {
          // Pause
          clearInterval(state.examTimerInterval);
          state.examTimerRunning = false;
          toggleBtn.textContent = '▶ Продолжить';
          toggleBtn.className = 'timer-btn timer-btn-start';
        } else {
          // Start
          state.examTimerRunning = true;
          toggleBtn.textContent = '⏸ Пауза';
          toggleBtn.className = 'timer-btn timer-btn-pause';
          state.examTimerInterval = setInterval(() => {
            if (state.examTimerSeconds > 0) {
              state.examTimerSeconds--;
              const digits = document.getElementById('examTimerDigits');
              if (digits) digits.textContent = formatExamTimer(state.examTimerSeconds);
            } else {
              clearInterval(state.examTimerInterval);
              state.examTimerRunning = false;
              alert('⏰ Время вышло! 90 минут завершились. Проверьте свои решения.');
              if (digits) digits.textContent = '00:00';
            }
          }, 1000);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(state.examTimerInterval);
        state.examTimerRunning = false;
        state.examTimerSeconds = 90 * 60;
        const digits = document.getElementById('examTimerDigits');
        if (digits) digits.textContent = formatExamTimer(state.examTimerSeconds);
        if (toggleBtn) {
          toggleBtn.textContent = '▶ Старт (90 мин)';
          toggleBtn.className = 'timer-btn timer-btn-start';
        }
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        state.generatedVariant = getExamVariant(state.activeExamLevel, state.activeExamVariantId);
        updateGeneratedVariantDOM();
      });
    }

    // Solution reveal buttons
    document.querySelectorAll('.btn-reveal-solution').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;
        const isHidden = target.style.display === 'none';
        target.style.display = isHidden ? 'block' : 'none';
        btn.classList.toggle('active', isHidden);
        const textSpan = btn.querySelector('.reveal-text');
        const arrowSpan = btn.querySelector('.reveal-arrow');
        if (isHidden) {
          if (textSpan) textSpan.textContent = 'Скрыть решение и ответ';
          if (arrowSpan) arrowSpan.textContent = '▲';
          if (window.renderMathInElement) {
            renderMathInElement(target, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
              ],
              throwOnError: false
            });
          }
        } else {
          if (textSpan) textSpan.textContent = 'Показать решение и ответ';
          if (arrowSpan) arrowSpan.textContent = '▼';
        }
      });
    });
  }

  function renderExamTaskCard(task) {
    return `
      <article class="exam-task-card" id="${task.id}">
        <div class="exam-task-header">
          <div class="exam-task-title-wrap">
            <span class="exam-task-num-badge">Задание ${task.num}</span>
            <span class="exam-task-code-badge">${task.code}</span>
            <h2 class="exam-task-title">${task.title}</h2>
          </div>
          <div style="font-size: 13px; color: var(--text-dim); font-weight: 500;">
            ${task.topic}
          </div>
        </div>

        <div class="exam-task-synopsis">
          ${task.synopsis}
        </div>

        <!-- Universal Algorithm Accordion ("Как решать") -->
        ${task.algorithm ? `
          <details class="exam-algorithm-box" id="algo-${task.id}">
            <summary class="exam-algorithm-summary">
              <div class="algo-summary-title">
                <span class="algo-icon">💡</span>
                <span class="algo-heading">Как решать: универсальный пошаговый алгоритм</span>
              </div>
              <div class="algo-summary-cta">
                Развернуть алгоритм <span class="spoiler-arrow">▼</span>
              </div>
            </summary>
            <div class="exam-algorithm-body">
              ${task.algorithm}
            </div>
          </details>
        ` : ''}

        <!-- Theory & Practice Cross-Links -->
        <div class="exam-links-box">
          <div class="exam-links-header">
            <span>🔗</span> Связанные материалы в базе знаний курса:
          </div>
          ${task.theoryLinks && task.theoryLinks.length > 0 ? `
            <div class="exam-links-group">
              <div class="exam-links-group-label">Теория:</div>
              <div class="exam-links-pills">
                ${task.theoryLinks.map(l => `
                  <a href="#topic-${l.id}" class="exam-link-pill theory">
                    <span>📖</span> ${l.title}
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${task.practiceLinks && task.practiceLinks.length > 0 ? `
            <div class="exam-links-group">
              <div class="exam-links-group-label">Практика и алгоритмы:</div>
              <div class="exam-links-pills">
                ${task.practiceLinks.map(l => `
                  <a href="#topic-${l.id}" class="exam-link-pill practice">
                    <span>⚡</span> ${l.title}
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Formatting Checklist -->
        <div class="exam-rules-box">
          <h4>⚠️ Как оформить, чтобы учитель принял обязательно:</h4>
          <ul>
            ${task.formattingRules.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>

        <!-- Problems Spoilers -->
        <div class="exam-problems-heading">
          <span>📚</span> Задачи по этой теме с подробными решениями (включая варианты 2, 3, 4):
        </div>

        <div class="exam-problems-list">
          ${task.problems.map(prob => `
            <details class="exam-spoiler" id="${prob.id}">
              <summary>
                <div class="spoiler-title">
                  <span class="spoiler-label">${prob.label}</span>
                  ${prob.difficulty === 'basic' ? '<span class="prob-diff-badge basic">Базовый</span>' : ''}
                  ${prob.difficulty === 'medium' ? '<span class="prob-diff-badge medium">⭐ Рекомендуемый</span>' : ''}
                  ${prob.difficulty === 'hard' ? '<span class="prob-diff-badge hard">Сложный</span>' : ''}
                </div>
                <div class="spoiler-cta">
                  Показать решение <span class="spoiler-arrow">▼</span>
                </div>
              </summary>
              <div class="exam-spoiler-body">
                <div class="exam-condition-box">
                  <strong>Условие:</strong>
                  <div>${prob.condition}</div>
                </div>
                <div class="exam-quick-answer">
                  <strong>Краткий ответ для самопроверки:</strong>
                  <div>${prob.quickAnswer}</div>
                </div>
                <div class="exam-solution-body">
                  ${prob.fullSolution}
                </div>
                ${prob.examinerNotes ? `
                  <div class="exam-examiner-callout">
                    <span style="font-size: 16px;">💡</span>
                    <div>
                      <strong>На что смотрит преподаватель:</strong> ${prob.examinerNotes}
                    </div>
                  </div>
                ` : ''}
              </div>
            </details>
          `).join('')}
        </div>
      </article>
    `;
  }

  function renderExamMath() {
    if (!examView) return;
    if (window.renderMathInElement) {
      renderMathInElement(examView, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } else {
      window.addEventListener('load', () => {
        if (window.renderMathInElement) {
          renderMathInElement(examView, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    }
  }

  // Switch View to Colloquium Guide
  function showColloquiumView(targetId) {
    state.currentView = 'colloquium';
    state.activeTab = 'colloquium';
    state.returnTab = null;
    setActiveTab('colloquium');

    if (sidebarBackBtn) sidebarBackBtn.textContent = '← Ко всем темам';
    if (footerBackLink) footerBackLink.textContent = 'К списку модулей';

    catalogView.style.display = 'none';
    topicView.style.display = 'none';
    if (examView) examView.style.display = 'none';
    if (colloquiumView) {
      colloquiumView.style.display = 'block';

      if (targetId && targetId.startsWith('ticket-')) {
        state.activeColloqTicketId = targetId;
      }

      renderColloquiumView();
      renderColloquiumMath();

      if (targetId && targetId.startsWith('ticket-')) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            colloquiumView.querySelectorAll('.colloq-ticket-card').forEach(c => c.classList.remove('focused'));
            el.classList.add('focused');
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Render Full Colloquium View with Sticky Navigation & Focus Mode
  function renderColloquiumView() {
    const d = (typeof COLLOQUIUM_DATA !== 'undefined') ? COLLOQUIUM_DATA : (window.COLLOQUIUM_DATA || null);
    if (!colloquiumView || !d) {
      console.warn('COLLOQUIUM_DATA or colloquiumView not found', { colloquiumView, d });
      return;
    }

    const currentTicketId = state.activeColloqTicketId || 'ticket-1';
    const isSingleMode = state.colloqMode === 'single';

    colloquiumView.innerHTML = `
      <!-- Colloquium Hero Banner -->
      <section class="colloq-hero">
        <div class="colloq-hero-header">
          <div class="colloq-hero-title">
            <h1>🎓 ${d.meta.title}</h1>
            <p>${d.meta.subtitle}</p>
          </div>
          <div class="colloq-hero-badges">
            <span class="colloq-badge colloq-badge-count">📚 19 билетов</span>
            <span class="colloq-badge colloq-badge-source">📖 По учебнику С.Н. Ильина (КФУ)</span>
            <span class="colloq-badge colloq-badge-proofs">⚡ Подробные доказательства и частые вопросы</span>
          </div>
        </div>

        <div class="colloq-meta-grid">
          <div class="colloq-meta-box">
            <h4>🎯 Рекомендации к устному ответу на коллоквиуме</h4>
            <ul>
              ${d.meta.oralExamTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          <div class="colloq-meta-box">
            <h4>📚 Рекомендуемая литература</h4>
            <ul>
              ${d.meta.sources.map(s => `
                <li><strong>${s.code} ${s.author}</strong> «${s.title}» (${s.publisher}) — <em>${s.note}</em></li>
              `).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- STICKY QUICK-NAVIGATION BAR (ALWAYS ACCESSIBLE WITHOUT SCROLLING UP) -->
      <div class="colloq-sticky-bar" id="colloqStickyBar">
        <div class="colloq-sticky-top-row">
          <div class="colloq-sticky-title">
            <span>Быстрый переход к билету:</span>
          </div>
          <div class="colloq-sticky-actions">
            <!-- View Mode Switch -->
            <button type="button" class="colloq-mode-toggle ${isSingleMode ? 'active' : ''}" id="colloqModeToggleBtn">
              ${isSingleMode ? '📖 Режим одного билета (включен)' : '📜 Режим: все билеты подряд'}
            </button>
          </div>
        </div>

        <!-- Thematic Block Filter Buttons -->
        <div class="colloq-block-filter" role="tablist" aria-label="Фильтр билетов по блокам">
          <button type="button" class="colloq-filter-btn ${state.activeColloqBlock === 'all' ? 'active' : ''}" data-block="all">Все билеты (1–19)</button>
          ${d.blocks.map(b => `
            <button type="button" class="colloq-filter-btn ${state.activeColloqBlock === b.id ? 'active' : ''}" data-block="${b.id}">${b.title} (${b.ticketsRange})</button>
          `).join('')}
        </div>

        <!-- Quick Jump Strip for 19 tickets -->
        <nav class="colloq-nav-strip" aria-label="Номера билетов для мгновенного перехода">
          ${d.tickets.map(t => `
            <button type="button" class="colloq-strip-btn ${t.id === currentTicketId ? 'active' : ''}" data-ticket="${t.id}" data-block="${t.blockId}" title="Билет ${t.num}: ${t.title}">
              ${t.num}
            </button>
          `).join('')}
        </nav>
      </div>

      <!-- Container with Tickets (Single Mode or All Mode) -->
      <div class="colloq-tickets-container" id="colloqTicketsContainer">
        ${isSingleMode ? renderSingleColloquiumTicketView(d, currentTicketId) : renderAllColloquiumTicketsView(d)}
      </div>

      <!-- Floating Action Button for easy return to top / tickets bar -->
      <button type="button" class="floating-colloq-top" id="floatingColloqTop" title="Наверх к выбору билетов">
        ↑ К выбору билетов
      </button>
    `;

    // Attach mode toggle handler
    const modeBtn = document.getElementById('colloqModeToggleBtn');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        state.colloqMode = state.colloqMode === 'single' ? 'all' : 'single';
        renderColloquiumView();
        renderColloquiumMath();
      });
    }

    function switchColloquiumTicket(ticketId) {
      state.activeColloqTicketId = ticketId;
      history.pushState(null, null, `#${ticketId}`);

      if (state.colloqMode === 'single') {
        const container = document.getElementById('colloqTicketsContainer');
        if (container) {
          container.innerHTML = renderSingleColloquiumTicketView(d, ticketId);
          attachColloqPagerEvents();
          renderColloquiumMath();
        }

        // Center active strip button
        colloquiumView.querySelectorAll('.colloq-strip-btn').forEach(b => {
          const isCur = b.dataset.ticket === ticketId;
          b.classList.toggle('active', isCur);
          if (isCur) {
            b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });

        const stickyBar = document.getElementById('colloqStickyBar');
        if (stickyBar) {
          stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        colloquiumView.querySelectorAll('.colloq-strip-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = colloquiumView.querySelector(`.colloq-strip-btn[data-ticket="${ticketId}"]`);
        if (activeBtn) {
          activeBtn.classList.add('active');
          activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        const el = document.getElementById(ticketId);
        if (el) {
          colloquiumView.querySelectorAll('.colloq-ticket-card').forEach(c => c.classList.remove('focused'));
          el.classList.add('focused');
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    function attachColloqPagerEvents() {
      colloquiumView.querySelectorAll('.colloq-pager-btn').forEach(btn => {
        btn.onclick = () => {
          const targetId = btn.dataset.ticket;
          if (targetId) switchColloquiumTicket(targetId);
        };
      });
    }

    // Attach strip button clicks
    colloquiumView.querySelectorAll('.colloq-strip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticketId = btn.dataset.ticket;
        switchColloquiumTicket(ticketId);
      });
    });

    // Block filter event listeners
    colloquiumView.querySelectorAll('.colloq-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colloquiumView.querySelectorAll('.colloq-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const chosenBlock = btn.dataset.block;
        state.activeColloqBlock = chosenBlock;

        // In single mode, if active ticket is not in chosen block, pick first ticket of block
        if (state.colloqMode === 'single' && chosenBlock !== 'all') {
          const firstInBlock = d.tickets.find(t => t.blockId === chosenBlock);
          if (firstInBlock) {
            state.activeColloqTicketId = firstInBlock.id;
            renderColloquiumView();
            renderColloquiumMath();
            return;
          }
        }

        const ticketCards = colloquiumView.querySelectorAll('.colloq-ticket-card');
        const stripBtns = colloquiumView.querySelectorAll('.colloq-strip-btn');

        ticketCards.forEach(card => {
          if (chosenBlock === 'all' || card.dataset.block === chosenBlock) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        stripBtns.forEach(pill => {
          if (chosenBlock === 'all' || pill.dataset.block === chosenBlock) {
            pill.style.display = 'inline-flex';
          } else {
            pill.style.display = 'none';
          }
        });
      });
    });

    attachColloqPagerEvents();

    // Attach floating button
    const floatBtn = document.getElementById('floatingColloqTop');
    if (floatBtn) {
      floatBtn.addEventListener('click', () => {
        const stickyBar = document.getElementById('colloqStickyBar');
        if (stickyBar) {
          stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      window.addEventListener('scroll', () => {
        if (state.currentView === 'colloquium') {
          floatBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        }
      });
    }

    // Attach spoiler toggle math renderer
    colloquiumView.querySelectorAll('.colloq-proof').forEach(spoiler => {
      spoiler.addEventListener('toggle', () => {
        if (spoiler.open && window.renderMathInElement) {
          renderMathInElement(spoiler, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    });
  }

  // Render Single Focused Ticket
  function renderSingleColloquiumTicketView(d, ticketId) {
    const currentIdx = d.tickets.findIndex(t => t.id === ticketId);
    const ticket = currentIdx !== -1 ? d.tickets[currentIdx] : d.tickets[0];
    const prevTicket = currentIdx > 0 ? d.tickets[currentIdx - 1] : null;
    const nextTicket = currentIdx < d.tickets.length - 1 ? d.tickets[currentIdx + 1] : null;

    const pagerHtml = `
      <div class="colloq-ticket-pager">
        ${prevTicket ? `
          <button type="button" class="colloq-pager-btn prev" data-ticket="${prevTicket.id}">
            ← Билет №${prevTicket.num}
          </button>
        ` : `<span></span>`}
        
        <div class="colloq-pager-indicator">
          <strong>Билет ${ticket.num}</strong> из ${d.tickets.length}
        </div>

        ${nextTicket ? `
          <button type="button" class="colloq-pager-btn next" data-ticket="${nextTicket.id}">
            Билет №${nextTicket.num} →
          </button>
        ` : `<span></span>`}
      </div>
    `;

    return `
      ${pagerHtml}
      ${renderColloquiumTicketCard(ticket)}
      ${pagerHtml}
    `;
  }

  // Render All Tickets sequentially
  function renderAllColloquiumTicketsView(d) {
    return d.tickets.map(ticket => renderColloquiumTicketCard(ticket)).join('');
  }

  // Render a Single Ticket Card
  function renderColloquiumTicketCard(ticket) {
    return `
      <article class="colloq-ticket-card focused" id="${ticket.id}" data-block="${ticket.blockId}">
        <header class="colloq-ticket-header">
          <div class="colloq-ticket-meta">
            <span class="colloq-ticket-num-badge">Билет №${ticket.num}</span>
            <span class="colloq-ticket-block-badge">${ticket.blockTitle}</span>
            <span class="colloq-ticket-source">📖 ${ticket.sourceRef}</span>
          </div>
          <h2 class="colloq-ticket-title">${ticket.title}</h2>
        </header>

        <!-- Questions in Ticket -->
        <div class="colloq-questions-box">
          <h4>Вопросы билета по программе коллоквиума:</h4>
          <ol>
            ${ticket.questions.map(q => `<li>${q}</li>`).join('')}
          </ol>
        </div>

        <!-- Oral Response Checklist -->
        <div class="colloq-checklist-box">
          <div class="colloq-checklist-title">
            <span>📋</span> Что обязательно должно быть в ответе студента у доски:
          </div>
          <ul>
            ${ticket.checklist.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <!-- Ticket Body Content -->
        <div class="colloq-ticket-content">
          ${ticket.sections.definitions ? ticket.sections.definitions : ''}
          ${ticket.sections.theoremsAndProofs ? ticket.sections.theoremsAndProofs : ''}
          ${ticket.sections.algorithmsOrMethods ? ticket.sections.algorithmsOrMethods : ''}
          ${ticket.sections.examTraps ? ticket.sections.examTraps : ''}
        </div>
      </article>
    `;
  }

  function renderColloquiumMath() {
    if (!colloquiumView) return;
    if (window.renderMathInElement) {
      renderMathInElement(colloquiumView, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } else {
      window.addEventListener('load', () => {
        if (window.renderMathInElement) {
          renderMathInElement(colloquiumView, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    }
  }

  // Filter items for current active tab or search
  function getTabItems() {
    if (state.searchQuery) {
      const q = state.searchQuery;
      // Search across all items so student can discover both theory and practice
      return COURSE_DATA.items.filter(item => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
        const inTopic = item.topic.toLowerCase().includes(q);
        const inSource = item.source.toLowerCase().includes(q);
        
        let inSections = false;
        for (const sec in item.sections) {
          if (item.sections[sec].toLowerCase().includes(q)) {
            inSections = true;
            break;
          }
        }

        return inTitle || inKeywords || inTopic || inSource || inSections;
      });
    }

    return COURSE_DATA.items.filter(item => {
      if (state.activeTab === 'theory') {
        return item.type !== 'practice';
      } else {
        return item.type === 'practice';
      }
    });
  }

  // LEVEL 1: Render Modules Grid or Dedicated Search Results
  function renderModules() {
    const items = getTabItems();
    modulesGrid.innerHTML = '';

    if (state.searchQuery) {
      // ==========================================
      // SEARCH RESULTS VIEW: DIRECT CLICKABLE TOPIC CARDS
      // ==========================================
      catalogHeading.textContent = 'Результаты поиска';
      catalogSubheading.textContent = `Материалы по запросу «${state.searchQuery}»`;
      catalogStats.textContent = `Найдено: ${items.length} ${pluralize(items.length, 'материал', 'материала', 'материалов')}`;

      if (items.length === 0) {
        modulesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
            <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
            <h3 style="font-size: 16px; color: var(--text-main); margin-bottom: 6px;">Ничего не найдено</h3>
            <p style="font-size: 13.5px;">Попробуйте изменить запрос (например: «гаусс», «матриц», «базис», «муавр», «ранг»).</p>
          </div>
        `;
        return;
      }

      const container = document.createElement('div');
      container.className = 'search-results-container';

      // Group matching items by modules
      COURSE_DATA.modules.forEach(mod => {
        const modItems = items.filter(i => i.moduleId === mod.id);
        if (modItems.length === 0) return;

        const groupEl = document.createElement('div');
        groupEl.className = 'search-module-group';

        groupEl.innerHTML = `
          <div class="search-module-header" style="cursor: pointer;" title="Открыть первый материал модуля">
            <div class="search-module-title">Модуль ${mod.num}: ${mod.title}</div>
            <div class="search-module-count">${modItems.length} ${pluralize(modItems.length, 'совпадение', 'совпадения', 'совпадений')} • Открыть модуль →</div>
          </div>
          <div class="search-results-list">
            ${modItems.map(item => {
              const typeLabel = item.type === 'practice' ? 'Практика' : (item.type === 'def' ? 'Определение' : 'Теория');
              let snippet = item.topic;
              if (item.keywords && item.keywords.length > 0) {
                snippet += ' • ' + item.keywords.slice(0, 4).join(', ');
              }
              return `
                <a href="#topic-${item.id}" class="search-result-card">
                  <div class="search-result-header">
                    <span class="search-type-badge ${item.type}">${typeLabel}</span>
                    <span class="search-item-title">${item.title}</span>
                  </div>
                  <div class="search-item-preview">📅 ${item.source} • ${snippet}</div>
                </a>
              `;
            }).join('')}
          </div>
        `;

        groupEl.querySelector('.search-module-header').addEventListener('click', () => {
          if (modItems.length > 0) {
            clearSearch();
            window.location.hash = `#topic-${modItems[0].id}`;
          }
        });

        groupEl.querySelectorAll('.search-result-card').forEach(card => {
          card.addEventListener('click', () => {
            clearSearch();
          });
        });

        container.appendChild(groupEl);
      });

      modulesGrid.appendChild(container);

    } else {
      // ==========================================
      // STANDARD MODULES OVERVIEW: WITH DIRECT TOPIC PILLS
      // ==========================================
      if (state.activeTab === 'theory') {
        catalogHeading.textContent = 'Теория';
        catalogSubheading.textContent = 'Определения, формулировки теорем, простые объяснения и строгие доказательства';
      } else {
        catalogHeading.textContent = 'Практика';
        catalogSubheading.textContent = 'Пошаговые алгоритмы, типовые задачи из семинаров и задачника Кострикина';
      }

      let totalCount = 0;

      COURSE_DATA.modules.forEach(mod => {
        const modItems = items.filter(i => i.moduleId === mod.id);
        if (modItems.length === 0) return;

        totalCount += modItems.length;

        const card = document.createElement('div');
        card.className = 'module-card';

        const countLabel = state.activeTab === 'theory' 
          ? `${modItems.length} ${pluralize(modItems.length, 'билет и определение', 'билета и определения', 'билетов и определений')}`
          : `${modItems.length} ${pluralize(modItems.length, 'задача и алгоритм', 'задачи и алгоритма', 'задач и алгоритмов')}`;

        // Top 5 topic preview pills inside card
        const previewPills = modItems.slice(0, 5).map(it => `
          <a href="#topic-${it.id}" class="topic-pill" title="${it.title}">
            ${it.title.length > 36 ? it.title.substring(0, 36) + '...' : it.title}
          </a>
        `).join('');

        card.innerHTML = `
          <div>
            <div class="module-header">
              <span class="module-num">Модуль ${mod.num}</span>
              <span class="module-dates">📅 ${mod.dates}</span>
            </div>
            <h2 class="module-title">${mod.title}</h2>
            <p class="module-desc">${mod.desc}</p>
          </div>

          <div>
            <div class="module-topics-preview">
              ${previewPills}
              ${modItems.length > 5 ? `<span class="topic-pill" style="opacity: 0.6;">+ ещё ${modItems.length - 5}</span>` : ''}
            </div>
            <div class="module-meta" style="margin-top: 14px;">
              <span>Доступно: <strong class="meta-count">${countLabel}</strong></span>
              <span style="color: var(--accent); font-size: 12.5px; font-weight: 500;">Открыть раздел →</span>
            </div>
          </div>
        `;

        // Card header click opens first topic of the module
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.topic-pill') && modItems.length > 0) {
            window.location.hash = `#topic-${modItems[0].id}`;
          }
        });

        modulesGrid.appendChild(card);
      });

      catalogStats.textContent = `Доступно в разделе: ${totalCount}`;
    }
  }

  // Helper for Russian plural forms
  function pluralize(n, one, two, five) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return five;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return two;
    return five;
  }

  // LEVEL 2: Render Syllabus Sidebar
  function renderSidebar() {
    sidebarContent.innerHTML = '';
    // Sidebar always displays the complete syllabus for the active tab (Theory or Practice)
    const tabItems = COURSE_DATA.items.filter(item => {
      if (state.activeTab === 'theory') {
        return item.type !== 'practice';
      } else {
        return item.type === 'practice';
      }
    });

    COURSE_DATA.modules.forEach(mod => {
      const modItems = tabItems.filter(i => i.moduleId === mod.id);
      if (modItems.length === 0) return;

      const group = document.createElement('div');
      group.className = 'sidebar-group';

      const isCurrentModule = mod.id === state.activeModuleId;

      group.innerHTML = `
        <div class="sidebar-group-title" data-mod="${mod.id}">
          <span>Модуль ${mod.num}: ${mod.title}</span>
          <span>${isCurrentModule ? '▾' : '▸'}</span>
        </div>
        <div class="sidebar-items-list" style="display: ${isCurrentModule ? 'flex' : 'none'};">
          ${modItems.map(item => `
            <a href="#topic-${item.id}" class="sidebar-item-link ${item.id === state.activeTopicId ? 'active' : ''}">
              ${item.title}
            </a>
          `).join('')}
        </div>
      `;

      const titleEl = group.querySelector('.sidebar-group-title');
      const listEl = group.querySelector('.sidebar-items-list');
      titleEl.addEventListener('click', () => {
        const isHidden = listEl.style.display === 'none';
        listEl.style.display = isHidden ? 'flex' : 'none';
        titleEl.querySelector('span:last-child').textContent = isHidden ? '▾' : '▸';
      });

      sidebarContent.appendChild(group);
    });
  }

  // LEVEL 2: Render Topic Content in Reader
  function renderTopicReader(item) {
    const mod = COURSE_DATA.modules.find(m => m.id === item.moduleId) || {};
    const sectionName = state.activeTab === 'theory' ? 'Теория' : 'Практика';
    
    // Breadcrumb (strictly Theory/Practice > Module > Title, no "Каталог")
    const breadcrumbHtml = `
      <div class="reader-breadcrumb">
        <a href="#${state.activeTab}">${sectionName}</a>
        <span>/</span>
        <a href="#${state.activeTab}">Модуль ${mod.num}</a>
        <span>/</span>
        <span>${item.title}</span>
      </div>
    `;

    // Title area
    const titleHtml = `
      <div class="reader-title-area">
        <div class="reader-source-tag">📅 ${item.source} • ${item.topic}</div>
        <h1 class="reader-title">${item.title}</h1>
      </div>
    `;

    let contentHtml = '';
    const renderedKeys = new Set(['intro']);

    if (item.type === 'practice') {
      // ==========================================
      // PRACTICE VIEW: ALGORITHM FIRST + EXAMPLES BUTTON
      // ==========================================

      // 1. Step-by-step Algorithm
      if (item.sections['Алгоритм']) {
        renderedKeys.add('Алгоритм');
        contentHtml += `
          <div class="content-block">
            <h3>Пошаговый алгоритм решения</h3>
            ${item.sections['Алгоритм']}
          </div>
        `;
        
        // Contextual glossary helper for elementary transforms
        if (item.id.includes('elementary') || item.id.includes('echelon') || item.id.includes('inverse') || item.id.includes('gauss') || item.id.includes('rank')) {
          contentHtml += createGlossaryInlineHelper('elem_transforms');
        }
      }

      // 2. Connected Theory Links
      if (item.theoryLinks && item.theoryLinks.length > 0) {
        contentHtml += `
          <div class="theory-links-card">
            <div class="theory-links-title">
              <span>📖</span>
              <span>Теоретическое обоснование алгоритма</span>
            </div>
            <div class="theory-links-desc">
              Данный метод строго доказан в следующих билетах программы курса:
            </div>
            <div class="theory-links-grid">
              ${item.theoryLinks.map(tl => `
                <a href="#topic-${tl.id}" class="theory-link-badge">
                  <span>${tl.title}</span>
                  <span>→</span>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }

      // 3. Common Exam Trap / Warnings
      if (item.trap) {
        contentHtml += `
          <div class="box-trap">
            <div class="box-trap-title">Типичная ошибка при вычислениях:</div>
            <div class="box-trap-text">${item.trap}</div>
          </div>
        `;
      }

      // 4. Worked Examples Section with dedicated Action Button
      let examplesHtml = '';
      if (item.sections['Пример']) {
        renderedKeys.add('Пример');
        examplesHtml += `
          <div class="content-block">
            <h3>Условие типовой задачи</h3>
            ${item.sections['Пример']}
          </div>
        `;
      }

      if (item.sections['Разбор']) {
        renderedKeys.add('Разбор');
        examplesHtml += `
          <div class="content-block">
            <h3>Подробный разбор решения</h3>
            ${item.sections['Разбор']}
          </div>
        `;
      }

      if (item.sections['Как оформить ответ']) {
        renderedKeys.add('Как оформить ответ');
        examplesHtml += `
          <div class="content-block">
            <h3>Правила оформления ответа на контрольной</h3>
            ${item.sections['Как оформить ответ']}
          </div>
        `;
      }

      if (item.sections['Задачи для самостоятельного решения']) {
        renderedKeys.add('Задачи для самостоятельного решения');
        examplesHtml += `
          <div class="content-block">
            <h3>Задачи для самостоятельного решения с ответами</h3>
            ${item.sections['Задачи для самостоятельного решения']}
          </div>
        `;
      }

      if (examplesHtml) {
        contentHtml += `
          <div class="practice-examples-toggle-wrapper">
            <button class="btn-examples-toggle" id="btnToggleExamples" type="button">
              <span class="btn-left">
                <span class="btn-icon">▼</span>
                <span class="btn-text">Посмотреть примеры решения задач по этому алгоритму</span>
              </span>
              <span class="btn-badge">Семинары и задачник Кострикина</span>
            </button>
            <div class="practice-examples-content" id="practiceExamplesContent" style="display: none;">
              ${examplesHtml}
            </div>
          </div>
        `;
      }

    } else {
      // ==========================================
      // THEORY VIEW: DEFINITION, SIMPLE EXPLANATION, FORMULATION, PROOF, EXAMPLES
      // ==========================================

      // 1. Definition if exists
      if (item.sections['Определение']) {
        renderedKeys.add('Определение');
        contentHtml += `
          <div class="content-block">
            <h3>Определение</h3>
            ${item.sections['Определение']}
          </div>
        `;
      }

      // 2. Intuitive Idea & Simple Explanations (Простыми словами / Суть)
      let simpleExplanationText = '';
      if (item.sections['Простыми словами']) {
        renderedKeys.add('Простыми словами');
        simpleExplanationText += item.sections['Простыми словами'];
      }
      if (item.sections['Простыми словами: как умножать матрицы']) {
        renderedKeys.add('Простыми словами: как умножать матрицы');
        simpleExplanationText += item.sections['Простыми словами: как умножать матрицы'];
      }
      if (item.sections['Суть метода простыми словами']) {
        renderedKeys.add('Суть метода простыми словами');
        simpleExplanationText += item.sections['Суть метода простыми словами'];
      }
      if (item.idea && !simpleExplanationText.includes(item.idea)) {
        simpleExplanationText += `<p>${item.idea}</p>`;
      }

      if (simpleExplanationText) {
        contentHtml += `
          <div class="box-idea">
            <div class="box-idea-title">💡 Суть простыми словами (интуитивное объяснение):</div>
            <div class="box-idea-text">${simpleExplanationText}</div>
          </div>
        `;
      }

      // 3. Formulation if exists
      if (item.sections['Формулировка']) {
        renderedKeys.add('Формулировка');
        contentHtml += `
          <div class="content-block">
            <h3>Формулировка</h3>
            ${item.sections['Формулировка']}
          </div>
        `;
      }
      if (item.sections['Формулировка теоремы']) {
        renderedKeys.add('Формулировка теоремы');
        contentHtml += `
          <div class="content-block">
            <h3>Формулировка теоремы</h3>
            ${item.sections['Формулировка теоремы']}
          </div>
        `;
      }

      // 4. Mathematical Proof
      if (item.sections['Доказательство']) {
        renderedKeys.add('Доказательство');
        contentHtml += `
          <div class="content-block">
            <details class="proof-spoiler" open>
              <summary>Строгое математическое доказательство</summary>
              <div class="proof-content">
                ${item.sections['Доказательство']}
              </div>
            </details>
          </div>
        `;
      }
      if (item.sections['Строгое доказательство']) {
        renderedKeys.add('Строгое доказательство');
        contentHtml += `
          <div class="content-block">
            <details class="proof-spoiler" open>
              <summary>Строгое математическое доказательство</summary>
              <div class="proof-content">
                ${item.sections['Строгое доказательство']}
              </div>
            </details>
          </div>
        `;
      }

      // 5. Concrete Worked Examples in Theory
      for (const secKey in item.sections) {
        if (secKey.toLowerCase().includes('пример')) {
          renderedKeys.add(secKey);
          contentHtml += `
            <div class="content-block theory-example-block">
              <h3>${secKey}</h3>
              ${item.sections[secKey]}
            </div>
          `;
        }
      }

      // 6. Notes & Remarks
      if (item.sections['Замечания']) {
        renderedKeys.add('Замечания');
        contentHtml += `
          <div class="content-block">
            <h3>Замечания и свойства</h3>
            ${item.sections['Замечания']}
          </div>
        `;
      }

      // 7. Render Any Remaining Sections Not Yet Rendered
      for (const secKey in item.sections) {
        if (!renderedKeys.has(secKey)) {
          contentHtml += `
            <div class="content-block">
              <h3>${secKey}</h3>
              ${item.sections[secKey]}
            </div>
          `;
        }
      }

      // 8. Exam Trap / Warning Box
      if (item.trap) {
        contentHtml += `
          <div class="box-trap">
            <div class="box-trap-title">Типичная ошибка на коллоквиуме:</div>
            <div class="box-trap-text">${item.trap}</div>
          </div>
        `;
      }
    }

    // Render into reader container
    topicReader.innerHTML = `
      ${breadcrumbHtml}
      ${titleHtml}
      <div class="reader-body">
        ${contentHtml}
      </div>
    `;

    // Attach toggle handler for Practice Examples button
    if (item.type === 'practice') {
      const btnToggle = document.getElementById('btnToggleExamples');
      const contentToggle = document.getElementById('practiceExamplesContent');
      if (btnToggle && contentToggle) {
        btnToggle.addEventListener('click', () => {
          const isHidden = contentToggle.style.display === 'none';
          contentToggle.style.display = isHidden ? 'block' : 'none';
          const icon = btnToggle.querySelector('.btn-icon');
          const text = btnToggle.querySelector('.btn-text');
          if (isHidden) {
            icon.textContent = '▲';
            text.textContent = 'Скрыть примеры решения задач';
            btnToggle.classList.add('open');
          } else {
            icon.textContent = '▼';
            text.textContent = 'Посмотреть примеры решения задач по этому алгоритму';
            btnToggle.classList.remove('open');
          }
        });
      }
    }

    // Render KaTeX formulas
    renderMath();
  }

  // Create an inline interactive micro-glossary helper
  function createGlossaryInlineHelper(termKey) {
    const g = GLOSSARY_DATA[termKey];
    if (!g) return '';

    return `
      <details class="glossary-box">
        <summary style="cursor: pointer; font-weight: 600; color: var(--accent); user-select: none;">
          ℹ️ Справка: ${g.term} (нажмите, чтобы посмотреть правила)
        </summary>
        <div style="margin-top: 10px; font-size: 13.5px; line-height: 1.6;">
          <p><strong>Суть:</strong> ${g.summary}</p>
          <ul>
            ${g.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
          ${g.example ? `<div style="margin: 8px 0;">${g.example}</div>` : ''}
          <p style="color: var(--callout-warn-text); font-size: 13px;"><strong>Правило:</strong> ${g.rule}</p>
        </div>
      </details>
    `;
  }

  // Render KaTeX formulas
  function renderMath() {
    if (window.renderMathInElement) {
      renderMathInElement(topicReader, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } else {
      window.addEventListener('load', () => {
        if (window.renderMathInElement) {
          renderMathInElement(topicReader, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    }
  }
});
