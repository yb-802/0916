(function () {
  'use strict';

  // --- Default Profile Configuration ---
  const DEFAULT_PROFILE = {
    name: '施閔翎',
    dept: '資工系 · NLP',
    bio: '專注於自然語言處理 (NLP)、機器學習與演算法研究，熱衷探索智慧技術與多元應用。',
    avatar: 'assets/avatar.png',
    skills: [
      { name: 'Python', category: '程式語言 / AI 開發', icon: '🐍' },
      { name: 'C++', category: '核心程式 / 高效能運算', icon: '⚡' },
      { name: 'Machine Learning', category: '人工智慧 / 演算法', icon: '🧠' }
    ],
    projects: [
      {
        title: 'ai-trashcan',
        desc: '基於機器學習與電腦視覺之智慧垃圾分類辨識系統，實現自動化辨識與資源回收分流。',
        url: 'https://github.com/yb-802/ai-trashcan.git',
        tags: ['Python', 'Machine Learning', 'Computer Vision', 'IoT']
      }
    ]
  };

  // --- Profile State Management ---
  let userProfile = loadProfile();

  function loadProfile() {
    try {
      const saved = localStorage.getItem('shih_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved profile, using defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  function saveProfile(profileData) {
    userProfile = profileData;
    localStorage.setItem('shih_user_profile', JSON.stringify(userProfile));
    renderAll();
  }

  // --- DOM Elements ---
  // Top nav & brand
  const navBrandText = document.getElementById('navBrandText');
  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatModeText = document.getElementById('formatModeText');
  const themePills = document.querySelectorAll('.theme-pill');

  // Profile Elements
  const profileAvatar = document.getElementById('profileAvatar');
  const quickAvatarBtn = document.getElementById('quickAvatarBtn');
  const profileNameDisplay = document.getElementById('profileNameDisplay');
  const deptText = document.getElementById('deptText');
  const profileBioDisplay = document.getElementById('profileBioDisplay');
  const greetingText = document.getElementById('greetingText');
  const openEditModalBtn = document.getElementById('openEditModalBtn');

  // Clock Elements
  const timeMain = document.getElementById('timeMain');
  const timeSeconds = document.getElementById('timeSeconds');
  const timePeriod = document.getElementById('timePeriod');
  const dateFullText = document.getElementById('dateFullText');
  const dayOfYearBadge = document.getElementById('dayOfYearBadge');
  const timezoneText = document.getElementById('timezoneText');

  // Sections
  const skillsGrid = document.getElementById('skillsGrid');
  const projectsGrid = document.getElementById('projectsGrid');

  // Modal Elements
  const profileModal = document.getElementById('profileModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
  const modalAvatarPreview = document.getElementById('modalAvatarPreview');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const avatarUrlInput = document.getElementById('avatarUrlInput');
  const inputProfileName = document.getElementById('inputProfileName');
  const inputProfileDept = document.getElementById('inputProfileDept');
  const inputProfileBio = document.getElementById('inputProfileBio');
  const inputProfileSkills = document.getElementById('inputProfileSkills');
  const inputProjTitle = document.getElementById('inputProjTitle');
  const inputProjUrl = document.getElementById('inputProjUrl');
  const inputProjDesc = document.getElementById('inputProjDesc');
  const inputProjTags = document.getElementById('inputProjTags');

  // Widgets
  const focusDisplay = document.getElementById('focusDisplay');
  const focusEditBox = document.getElementById('focusEditBox');
  const focusInput = document.getElementById('focusInput');
  const focusSaveBtn = document.getElementById('focusSaveBtn');
  const editFocusBtn = document.getElementById('editFocusBtn');

  const timerDigits = document.getElementById('timerDigits');
  const timerStartBtn = document.getElementById('timerStartBtn');
  const timerPauseBtn = document.getElementById('timerPauseBtn');
  const timerResetBtn = document.getElementById('timerResetBtn');
  const timerStatusIcon = document.getElementById('timerStatusIcon');

  const footerYear = document.getElementById('footerYear');

  // Temporary staging avatar during modal editing
  let stagedAvatarSrc = '';

  // App settings state
  let is24HourFormat = localStorage.getItem('hub_clock_24h') !== 'false';
  let currentTheme = localStorage.getItem('hub_theme') || 'aurora';
  let storedFocus = localStorage.getItem('hub_user_focus') || '今天就取得實質進展，並保持熱忱！';

  // Timer state
  const DEFAULT_TIMER_SECONDS = 25 * 60;
  let timerRemainingSeconds = DEFAULT_TIMER_SECONDS;
  let timerInterval = null;

  // --- Initialization ---
  function init() {
    initTheme();
    renderAll();
    initClock();
    initWidgets();
    initModalHandlers();
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
  }

  function renderAll() {
    renderProfile();
    renderSkills();
    renderProjects();
  }

  // --- Render Profile ---
  function renderProfile() {
    profileAvatar.src = userProfile.avatar || 'assets/avatar.png';
    profileNameDisplay.textContent = userProfile.name || '施閔翎';
    deptText.textContent = userProfile.dept || '資工系 · NLP';
    profileBioDisplay.textContent = userProfile.bio || '';
    navBrandText.textContent = `${userProfile.name} 的個人空間`;
    document.title = `${userProfile.name} | 個人專屬空間 & 即時時鐘`;
  }

  // --- Render Skills ---
  function renderSkills() {
    skillsGrid.innerHTML = '';
    const skills = userProfile.skills || [];

    skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';

      // Default icon heuristic if missing
      let icon = skill.icon || '💻';
      let category = skill.category || '專業技能';
      const name = typeof skill === 'string' ? skill : skill.name;

      if (name.toLowerCase().includes('python')) {
        icon = '🐍';
        category = '程式語言 / AI 開發';
      } else if (name.toLowerCase().includes('c++')) {
        icon = '⚡';
        category = '核心程式 / 高效能運算';
      } else if (name.toLowerCase().includes('machine learning') || name.toLowerCase().includes('ml')) {
        icon = '🧠';
        category = '人工智慧 / 演算法';
      } else if (name.toLowerCase().includes('nlp')) {
        icon = '🗣️';
        category = '自然語言處理';
      }

      card.innerHTML = `
        <div class="skill-icon-box" aria-hidden="true">${icon}</div>
        <div class="skill-detail">
          <div class="skill-name">${escapeHTML(name)}</div>
          <div class="skill-category">${escapeHTML(category)}</div>
        </div>
      `;
      skillsGrid.appendChild(card);
    });
  }

  // --- Render Projects ---
  function renderProjects() {
    projectsGrid.innerHTML = '';
    const projects = userProfile.projects || [];

    projects.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const tagsHtml = (proj.tags || []).map(t => `<span class="proj-tag">${escapeHTML(t)}</span>`).join('');

      card.innerHTML = `
        <div>
          <div class="project-card-header">
            <div class="project-title-group">
              <span class="project-avatar-icon">📦</span>
              <h3 class="project-name">${escapeHTML(proj.title)}</h3>
            </div>
            ${proj.url ? `
              <a href="${escapeHTML(proj.url)}" target="_blank" rel="noopener noreferrer" class="project-github-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>GitHub</span>
              </a>
            ` : ''}
          </div>
          <p class="project-desc" style="margin-top: 0.85rem;">${escapeHTML(proj.desc || '')}</p>
        </div>
        <div class="project-tags-list">
          ${tagsHtml}
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  // --- Modal Event Handlers ---
  function initModalHandlers() {
    function openModal() {
      // Populate fields from userProfile
      stagedAvatarSrc = userProfile.avatar || 'assets/avatar.png';
      modalAvatarPreview.src = stagedAvatarSrc;
      avatarUrlInput.value = (stagedAvatarSrc.startsWith('http') || stagedAvatarSrc.startsWith('assets')) ? stagedAvatarSrc : '';
      avatarFileInput.value = '';

      inputProfileName.value = userProfile.name || '';
      inputProfileDept.value = userProfile.dept || '';
      inputProfileBio.value = userProfile.bio || '';

      // Skills to comma-separated text
      const skillNames = (userProfile.skills || []).map(s => typeof s === 'string' ? s : s.name);
      inputProfileSkills.value = skillNames.join(', ');

      // First project
      const p = (userProfile.projects && userProfile.projects[0]) || {};
      inputProjTitle.value = p.title || '';
      inputProjUrl.value = p.url || '';
      inputProjDesc.value = p.desc || '';
      inputProjTags.value = (p.tags || []).join(', ');

      profileModal.classList.add('active');
      profileModal.setAttribute('aria-hidden', 'false');
      inputProfileName.focus();
    }

    function closeModal() {
      profileModal.classList.remove('active');
      profileModal.setAttribute('aria-hidden', 'true');
    }

    openEditModalBtn.addEventListener('click', openModal);
    quickAvatarBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Handle Avatar File Upload
    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          stagedAvatarSrc = loadEvt.target.result;
          modalAvatarPreview.src = stagedAvatarSrc;
          avatarUrlInput.value = '';
        };
        reader.readAsDataURL(file);
      }
    });

    // Handle Avatar URL Input
    avatarUrlInput.addEventListener('input', () => {
      const url = avatarUrlInput.value.trim();
      if (url) {
        stagedAvatarSrc = url;
        modalAvatarPreview.src = stagedAvatarSrc;
      }
    });

    // Reset Defaults
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('確定要將個人檔案重設為系統預設值嗎？')) {
        saveProfile(JSON.parse(JSON.stringify(DEFAULT_PROFILE)));
        closeModal();
      }
    });

    // Save Profile Form
    saveProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newName = inputProfileName.value.trim();
      const newDept = inputProfileDept.value.trim();
      const newBio = inputProfileBio.value.trim();

      if (!newName) {
        alert('請填寫姓名！');
        inputProfileName.focus();
        return;
      }

      // Parse skills
      const rawSkills = inputProfileSkills.value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
      const updatedSkills = rawSkills.length > 0 ? rawSkills.map(s => ({ name: s })) : DEFAULT_PROFILE.skills;

      // Parse project
      const projTitle = inputProjTitle.value.trim() || 'ai-trashcan';
      const projUrl = inputProjUrl.value.trim() || 'https://github.com/yb-802/ai-trashcan.git';
      const projDesc = inputProjDesc.value.trim() || '基於機器學習與電腦視覺之智慧垃圾分類辨識系統。';
      const projTags = inputProjTags.value.split(/[,，]/).map(t => t.trim()).filter(Boolean);

      const updatedProject = {
        title: projTitle,
        desc: projDesc,
        url: projUrl,
        tags: projTags.length > 0 ? projTags : ['Python', 'Machine Learning', 'Computer Vision']
      };

      const updatedProfile = {
        name: newName,
        dept: newDept || '資工系 · NLP',
        bio: newBio,
        avatar: stagedAvatarSrc || userProfile.avatar || 'assets/avatar.png',
        skills: updatedSkills,
        projects: [updatedProject]
      };

      saveProfile(updatedProfile);
      closeModal();
    });
  }

  // --- Theme Handling ---
  function initTheme() {
    applyTheme(currentTheme);
    themePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const theme = pill.getAttribute('data-set-theme');
        applyTheme(theme);
      });
    });
  }

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('hub_theme', theme);
    if (theme === 'aurora') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    themePills.forEach(pill => {
      if (pill.getAttribute('data-set-theme') === theme) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // --- Real-Time Clock & Date Engine ---
  function initClock() {
    updateClock();
    setInterval(updateClock, 1000);

    formatToggleBtn.addEventListener('click', () => {
      is24HourFormat = !is24HourFormat;
      localStorage.setItem('hub_clock_24h', is24HourFormat);
      updateClock();
    });

    try {
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
      const offsetMin = -new Date().getTimezoneOffset();
      const sign = offsetMin >= 0 ? '+' : '-';
      const hours = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, '0');
      const mins = String(Math.abs(offsetMin) % 60).padStart(2, '0');
      timezoneText.textContent = `UTC${sign}${hours}:${mins} (${tzName})`;
    } catch (e) {
      timezoneText.textContent = 'UTC+08:00 (Asia/Taipei)';
    }
  }

  function updateClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Greeting
    let greeting = 'Hello,';
    if (hours24 >= 5 && hours24 < 12) {
      greeting = 'Good morning,';
    } else if (hours24 >= 12 && hours24 < 17) {
      greeting = 'Good afternoon,';
    } else if (hours24 >= 17 && hours24 < 22) {
      greeting = 'Good evening,';
    } else {
      greeting = 'Good night,';
    }
    greetingText.textContent = greeting;

    // Time Format
    let displayHours = hours24;
    let period = '';

    if (!is24HourFormat) {
      period = hours24 >= 12 ? 'PM' : 'AM';
      displayHours = hours24 % 12 || 12;
      formatModeText.textContent = '12H';
    } else {
      formatModeText.textContent = '24H';
    }

    const formattedHours = String(displayHours).padStart(2, '0');
    timeMain.innerHTML = `${formattedHours}<span class="time-colon">:</span>${minutes}`;
    timeSeconds.textContent = seconds;
    timePeriod.textContent = period;

    // Full Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateFullText.textContent = now.toLocaleDateString('zh-TW', options);

    // Day of Year Badge
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = (now - startOfYear) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    dayOfYearBadge.textContent = `Day ${dayOfYear} of ${now.getFullYear()}`;
  }

  // --- Widgets: Daily Focus & Focus Timer ---
  function initWidgets() {
    focusDisplay.textContent = storedFocus;

    const startFocusEdit = () => {
      focusInput.value = storedFocus;
      focusDisplay.style.display = 'none';
      focusEditBox.classList.add('active');
      focusInput.focus();
    };

    const saveFocus = () => {
      const val = focusInput.value.trim();
      if (val) {
        storedFocus = val;
        localStorage.setItem('hub_user_focus', storedFocus);
        focusDisplay.textContent = storedFocus;
      }
      focusDisplay.style.display = 'block';
      focusEditBox.classList.remove('active');
    };

    focusDisplay.addEventListener('click', startFocusEdit);
    editFocusBtn.addEventListener('click', startFocusEdit);
    focusSaveBtn.addEventListener('click', saveFocus);
    focusInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveFocus();
      } else if (e.key === 'Escape') {
        focusDisplay.style.display = 'block';
        focusEditBox.classList.remove('active');
      }
    });

    renderTimer();

    timerStartBtn.addEventListener('click', () => {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          if (timerRemainingSeconds > 0) {
            timerRemainingSeconds--;
            renderTimer();
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
            timerStatusIcon.textContent = '🎉';
            alert('專注時間結束！恭喜完成一個番茄鐘階段。');
            resetTimer();
          }
        }, 1000);
        timerStartBtn.style.display = 'none';
        timerPauseBtn.style.display = 'inline-block';
        timerStatusIcon.textContent = '🔥';
      }
    });

    timerPauseBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStartBtn.style.display = 'inline-block';
        timerPauseBtn.style.display = 'none';
        timerStatusIcon.textContent = '⏸️';
      }
    });

    const resetTimer = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerRemainingSeconds = DEFAULT_TIMER_SECONDS;
      renderTimer();
      timerStartBtn.style.display = 'inline-block';
      timerPauseBtn.style.display = 'none';
      timerStatusIcon.textContent = '⏳';
    };

    timerResetBtn.addEventListener('click', resetTimer);
  }

  function renderTimer() {
    const mins = String(Math.floor(timerRemainingSeconds / 60)).padStart(2, '0');
    const secs = String(timerRemainingSeconds % 60).padStart(2, '0');
    timerDigits.textContent = `${mins}:${secs}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Auto boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
