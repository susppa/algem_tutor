/**
 * Алгем — Интерактивное приложение курса
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeTab: 'theory',   // 'theory' | 'practice'
    currentView: 'modules', // 'modules' | 'topic'
    activeModuleId: null,
    activeTopicId: null,
    searchQuery: ''
  };

  // DOM Elements
  const catalogView = document.getElementById('catalogView');
  const topicView = document.getElementById('topicView');
  const examView = document.getElementById('examView');
  const modulesGrid = document.getElementById('modulesGrid');
  const sidebarContent = document.getElementById('sidebarContent');
  const topicReader = document.getElementById('topicReader');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchDropdown = document.getElementById('searchDropdown');
  const sidebarBackBtn = document.getElementById('sidebarBackBtn');
  const brandLink = document.getElementById('brandLink');
  const footerBackLink = document.getElementById('footerBackLink');
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

    if (footerBackLink) {
      footerBackLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearSearch();
        window.location.hash = `#${state.activeTab}`;
      });
    }

    // Sidebar back button
    sidebarBackBtn.addEventListener('click', () => {
      clearSearch();
      window.location.hash = `#${state.activeTab}`;
    });

    // Navigation Tabs (Теория vs Практика vs Контрольная)
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.dataset.tab;
        
        clearSearch();
        if (state.activeTab === 'exam') {
          showExamView();
          window.location.hash = '#exam';
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

    if (matches.length === 0 && examMatches.length === 0) {
      searchDropdown.innerHTML = `<div class="search-dropdown-empty">Ничего не найдено по запросу «${q}»</div>`;
      searchDropdown.style.display = 'block';
      return;
    }

    let html = '';
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
    
    if (!hash || hash === 'theory') {
      setActiveTab('theory');
      showModulesView();
      renderModules();
    } else if (hash === 'practice') {
      setActiveTab('practice');
      showModulesView();
      renderModules();
    } else if (hash === 'exam' || hash.startsWith('task-')) {
      setActiveTab('exam');
      showExamView(hash);
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
    catalogView.style.display = 'block';
    topicView.style.display = 'none';
    if (examView) examView.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch View to Topic Detail
  function showTopicView(topicId) {
    const item = COURSE_DATA.items.find(i => i.id === topicId);
    if (!item) {
      showModulesView();
      return;
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

    renderSidebar();
    renderTopicReader(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch View to Exam Guide
  function showExamView(targetId) {
    state.currentView = 'exam';
    state.activeTab = 'exam';
    setActiveTab('exam');

    catalogView.style.display = 'none';
    topicView.style.display = 'none';
    if (examView) {
      examView.style.display = 'block';
      renderExamView();
      renderExamMath();

      if (targetId && targetId.startsWith('task-')) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Render Full Exam View with 5 Tasks, Synopsis, Rules, and Collapsible Solutions
  function renderExamView() {
    const d = (typeof EXAM_DATA !== 'undefined') ? EXAM_DATA : (typeof window !== 'undefined' ? window.EXAM_DATA : null);
    if (!examView || !d) {
      console.warn('EXAM_DATA or examView not found', { examView, d });
      return;
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

      <!-- Quick Jump Nav Pills -->
      <nav class="exam-nav-pills" aria-label="Быстрый переход к заданиям контрольной">
        ${d.tasks.map(t => `
          <a href="#${t.id}" class="exam-nav-pill">
            <span class="pill-num">№${t.num}</span>
            <span>${t.code} (${t.title})</span>
          </a>
        `).join('')}
      </nav>

      <!-- 5 Exam Task Cards -->
      <div class="exam-tasks-container">
        ${d.tasks.map(task => renderExamTaskCard(task)).join('')}
      </div>
    `;

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

    // Attach details toggle listener so if user opens a spoiler, math renders cleanly
    examView.querySelectorAll('.exam-spoiler').forEach(spoiler => {
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
          <span>📚</span> Типовые задачи с решениями для самопроверки (нажмите, чтобы развернуть):
        </div>

        <div class="exam-problems-list">
          ${task.problems.map(prob => `
            <details class="exam-spoiler" id="${prob.id}">
              <summary>
                <div class="spoiler-title">
                  <span class="spoiler-label">${prob.label}</span>
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
