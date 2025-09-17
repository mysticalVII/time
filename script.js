let isFullDay = true;
let countdownInterval = null;

const toggleBtn = document.getElementById("toggleBtn");
const calcBtn = document.getElementById("calcBtn");
const timeInput = document.getElementById("timeInput");
const result = document.getElementById("result");
const countdown = document.getElementById("countdown");

toggleBtn.addEventListener("click", () => {
  isFullDay = !isFullDay;
  toggleBtn.textContent = isFullDay ? "FULL" : "HALF";
});

calcBtn.addEventListener("click", () => {
  const time = timeInput.value;
  if (!time) return;

  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return;

  // clear any previous countdown
  clearInterval(countdownInterval);

  const addedMinutes = isFullDay ? 9.5 * 60 : 4.5 * 60;
  const inTime = new Date();
  inTime.setHours(hours, minutes, 0);

  const outTime = new Date(inTime.getTime() + addedMinutes * 60000);

  // display end time
  result.textContent =
    "END TIME ► " +
    outTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // start countdown
  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = outTime - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdown.textContent = "TIME'S UP.";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdown.textContent = `TIME LEFT ► ${h}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, 1000);
});
