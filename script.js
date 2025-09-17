let countdownInterval;
let typingTimer;

document.getElementById('timeInput').addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(calculateTime, 1000); // 1 sec delay after typing stops
});

document.getElementById('shiftToggle').addEventListener('change', () => {
    const toggleText = document.getElementById('toggleText');
    if (document.getElementById('shiftToggle').checked) {
        toggleText.textContent = "Half Day (4.5 hrs)";
    } else {
        toggleText.textContent = "Full Day (9.5 hrs)";
    }
    calculateTime(); // re-calc immediately when toggle changes
});

function calculateTime() {
    const timeInput = document.getElementById('timeInput').value.trim();
    const result = document.getElementById('result');
    const countdown = document.getElementById('countdown');

    const shiftLength = document.getElementById('shiftToggle').checked ? 4.5 : 9.5;

    clearInterval(countdownInterval);

    let hours = null;
    let minutes = null;

    try {
        if (timeInput.includes(":")) {
            [hours, minutes] = timeInput.split(':').map(Number);
        } else if (timeInput.length >= 3) {
            const chars = timeInput.split("");
            if (chars[0] == "0") {
                hours = chars[0] + chars[1];
                minutes = chars[2] + chars[3];
            } else {
                hours = chars[0];
                minutes = chars[1] + chars[2];
            }
            hours = Number(hours);
            minutes = Number(minutes);
        } else {
            throw new Error('Invalid input');
        }

        const inTime = new Date();
        inTime.setHours(hours, minutes, 0);

        const newTime = new Date(inTime.getTime() + (shiftLength * 60) * 60 * 1000);
        const now = new Date();
        const timeLeft = newTime - now;

        if (timeLeft < 0) throw new Error('Time is in the past.');

        result.innerHTML = `Estimated clock out time: ${newTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}`;
        result.style.color = '#79dda3';

        countdownInterval = setInterval(() => updateCountdown(newTime), 1000);
    } catch (error) {
        result.innerHTML = 'Invalid time format. Please use HH:MM';
        result.style.color = '#d65b94';
        countdown.innerHTML = "";
    }
}

function updateCountdown(newTime) {
    const now = new Date();
    const timeLeft = newTime - now;

    if (timeLeft < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = 'Time has expired.';
        return;
    }

    const hoursLeft = Math.floor(timeLeft / 3600000);
    const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);
    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

    document.getElementById('countdown').innerHTML =
        `Time left: ${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    document.getElementById('countdown').style.color = '#79dda3';
}
