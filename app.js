(function () {
  'use strict';

  // --- DOM Elements ---
  const userNameDisplay = document.getElementById('userNameDisplay');
  const editNameBtn = document.getElementById('editNameBtn');
  const nameEditForm = document.getElementById('nameEditForm');
  const nameInput = document.getElementById('nameInput');
  const saveNameBtn = document.getElementById('saveNameBtn');
  const cancelNameBtn = document.getElementById('cancelNameBtn');

  const greetingText = document.getElementById('greetingText');
  const greetingSubtitle = document.getElementById('greetingSubtitle');

  const timeMain = document.getElementById('timeMain');
  const timeSeconds = document.getElementById('timeSeconds');
  const timePeriod = document.getElementById('timePeriod');
  const dateFullText = document.getElementById('dateFullText');
  const dayOfYearBadge = document.getElementById('dayOfYearBadge');
  const timezoneText = document.getElementById('timezoneText');

  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatModeText = document.getElementById('formatModeText');

  const themePills = document.querySelectorAll('.theme-pill');

  // Widgets
  const focusDisplay = document.getElementById('focusDisplay');
  const focusEditBox = document.getElementById('focusEditBox');
  const focusInput = document.getElementById('focusInput');
  const focusSaveBtn = document.getElementById('focusSaveBtn');
  const editFocusBtn = document.getElementById('editFocusBtn');

  // Focus Timer
  const timerDigits = document.getElementById('timerDigits');
  const timerStartBtn = document.getElementById('timerStartBtn');
  const timerPauseBtn = document.getElementById('timerPauseBtn');
  const timerResetBtn = document.getElementById('timerResetBtn');
  const timerStatusIcon = document.getElementById('timerStatusIcon');

  const footerYear = document.getElementById('footerYear');

  // --- State Variables ---
  let is24HourFormat = localStorage.getItem('hub_clock_24h') !== 'false'; // Default to 24H
  let currentTheme = localStorage.getItem('hub_theme') || 'aurora';
  let storedName = localStorage.getItem('hub_user_name') || 'Alex';
  let storedFocus = localStorage.getItem('hub_user_focus') || 'Make meaningful progress today and stay inspired!';

  // Timer state
  const DEFAULT_TIMER_SECONDS = 25 * 60;
  let timerRemainingSeconds = DEFAULT_TIMER_SECONDS;
  let timerInterval = null;

  // --- Initialization ---
  function init() {
    initTheme();
    initName();
    initClock();
    initWidgets();
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
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

  // --- Name Management ---
  function initName() {
    userNameDisplay.textContent = storedName;
    document.title = `${storedName}'s Personal Hub`;

    const enterEditMode = () => {
      nameInput.value = storedName;
      userNameDisplay.style.display = 'none';
      editNameBtn.style.display = 'none';
      nameEditForm.classList.add('active');
      nameInput.focus();
      nameInput.select();
    };

    const exitEditMode = () => {
      userNameDisplay.style.display = 'inline-block';
      editNameBtn.style.display = 'flex';
      nameEditForm.classList.remove('active');
    };

    const saveName = () => {
      const newName = nameInput.value.trim();
      if (newName) {
        storedName = newName;
        localStorage.setItem('hub_user_name', storedName);
        userNameDisplay.textContent = storedName;
        document.title = `${storedName}'s Personal Hub`;
      }
      exitEditMode();
    };

    userNameDisplay.addEventListener('click', enterEditMode);
    userNameDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterEditMode();
      }
    });

    editNameBtn.addEventListener('click', enterEditMode);
    saveNameBtn.addEventListener('click', saveName);
    cancelNameBtn.addEventListener('click', exitEditMode);

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveName();
      } else if (e.key === 'Escape') {
        exitEditMode();
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

    // Timezone display
    try {
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
      const offsetMin = -new Date().getTimezoneOffset();
      const sign = offsetMin >= 0 ? '+' : '-';
      const hours = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, '0');
      const mins = String(Math.abs(offsetMin) % 60).padStart(2, '0');
      timezoneText.textContent = `UTC${sign}${hours}:${mins} (${tzName})`;
    } catch (e) {
      timezoneText.textContent = 'Local Time';
    }
  }

  function updateClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Greeting Calculation
    let greeting = 'Hello,';
    let subtitle = 'Welcome to your daily space.';
    if (hours24 >= 5 && hours24 < 12) {
      greeting = 'Good morning,';
      subtitle = 'Rise and shine! Have an inspiring and focused start today.';
    } else if (hours24 >= 12 && hours24 < 17) {
      greeting = 'Good afternoon,';
      subtitle = 'Keep up the great momentum for the rest of your day.';
    } else if (hours24 >= 17 && hours24 < 22) {
      greeting = 'Good evening,';
      subtitle = 'Hope you had a productive day. Time to unwind soon.';
    } else {
      greeting = 'Good night,';
      subtitle = 'Quiet hours. Rest well and recharge for tomorrow.';
    }
    greetingText.textContent = greeting;
    if (greetingSubtitle) {
      greetingSubtitle.innerHTML = `<span>✨</span> ${subtitle}`;
    }

    // Time Formatting
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

    // Full Date Formatting
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateFullText.textContent = now.toLocaleDateString(undefined, options);

    // Day of Year Badge
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = (now - startOfYear) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    dayOfYearBadge.textContent = `Day ${dayOfYear} of ${now.getFullYear()}`;
  }

  // --- Widgets: Daily Focus & Focus Timer ---
  function initWidgets() {
    // Focus of the Day
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

    // Pomodoro Timer
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
            alert('Focus session complete! Great work.');
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

  // Start app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
