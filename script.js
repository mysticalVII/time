let countdownInterval = null;

const timeInput = document.getElementById('timeInput');
const shiftToggle = document.getElementById('shiftToggle');
const calculateBtn = document.getElementById('calculateBtn');
const resultEl = document.getElementById('result');
const countdownEl = document.getElementById('countdown');
const shiftInfo = document.getElementById('shiftInfo');

function getShiftLength() {
  // unchecked = Full (9.5), checked = Half (4.5)
  return shiftToggle.checked ? 4.5 : 9.5;
}

function updateShiftInfo() {
  const isHalf = shiftToggle.checked;
  shiftInfo.innerHTML = `Shift: <strong>${isHalf ? 'Half Day (4.5 hrs)' : 'Full Day (9.5 hrs)'}</strong>`;
}

// Parse time string like "09:30", "930", "0930", "9:5" reasonably.
function parseTime(input) {
  if (!input) throw new Error('Empty');
  const s = input.trim();
  if (s.includes(':')) {
    const parts = s.split(':').map(p => p.trim());
    if (parts.length < 2) throw new Error('Bad format');
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    if (!Number.isFinite(h) || !Number.isFinite(m)) throw new Error('Bad numbers');
    if (h < 0 || h > 23 || m < 0 || m > 59) throw new Error('Out of range');
    return { h, m };
  } else {
    const digits = s.replace(/\D/g,'');
    if (digits.length === 4) {
      const h = Number(digits.slice(0,2));
      const m = Number(digits.slice(2));
      if (h < 0 || h > 23 || m < 0 || m > 59) throw new Error('Out of range');
      return { h, m };
    } else if (digits.length === 3) {
      const h = Number(digits.slice(0,1));
      const m = Number(digits.slice(1));
      if (h < 0 || h > 23 || m < 0 || m > 59) throw new Error('Out of range');
      return { h, m };
    } else if (digits.length === 2) {
      // interpret "09" as 09:00
      const h = Number(digits.slice(0,2));
      if (h < 0 || h > 23) throw new Error('Out of range');
      return { h, m: 0 };
    } else {
      throw new Error('Invalid format');
    }
  }
}

function calculateTime() {
  clearInterval(countdownInterval);
  countdownEl.textContent = '';

  const shiftLength = getShiftLength();
  const raw = timeInput.value.trim();

  try {
    const {h, m} = parseTime(raw);

    const inTime = new Date();
    inTime.setHours(h, m, 0, 0);

    // if user entered a clock-in time equal to midnight that is logically tomorrow,
    // we keep it same-day; this matches original behavior.
    const outTime = new Date(inTime.getTime() + shiftLength * 60 * 60 * 1000);
    const now = new Date();
    const timeLeft = outTime - now;

    if (!isFinite(outTime.getTime())) throw new Error('Bad time');

    if (timeLeft <= 0) {
      resultEl.style.color = getComputedStyle(document.body).getPropertyValue('--bad') || '#d65b94';
      resultEl.textContent = 'That shift already ended (or time in past).';
      return;
    }

    resultEl.style.color = getComputedStyle(document.body).getPropertyValue('--good') || '#79dda3';
    resultEl.innerHTML = `Estimated clock out time: <strong>${outTime.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</strong> (${shiftLength} hrs)`;

    // start countdown
    countdownInterval = setInterval(() => updateCountdown(outTime), 1000);
    updateCountdown(outTime); // immediate update
  } catch (err) {
    resultEl.style.color = getComputedStyle(document.body).getPropertyValue('--bad') || '#d65b94';
    resultEl.textContent = 'Invalid time. Use HH:MM or HMM (e.g. 09:30 or 930).';
  }
}

function updateCountdown(outTime) {
  const now = new Date();
  const left = outTime - now;
  if (left <= 0) {
    clearInterval(countdownInterval);
    countdownEl.textContent = 'Time has expired.';
    return;
  }
  const hh = Math.floor(left / 3600000);
  const mm = Math.floor((left % 3600000) / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  countdownEl.style.color = getComputedStyle(document.body).getPropertyValue('--good') || '#79dda3';
  countdownEl.textContent = `Time left: ${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

// UI wiring
calculateBtn.addEventListener('click', calculateTime);
timeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calculateTime();
});
shiftToggle.addEventListener('change', () => {
  updateShiftInfo();
  // If there's already a valid-looking input & an active countdown/result, re-calc automatically
  if (resultEl.textContent && timeInput.value.trim()) {
    calculateTime();
  }
});

// initial label
updateShiftInfo();
