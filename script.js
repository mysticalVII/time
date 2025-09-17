let countdownInterval;

function exeCalTime() {
    let key = event.key;
    if (key == "Enter") {
        calculateTime();
    }
}

function calculateTime() {
    const timeInput = document.getElementById('timeInput').value;
    const result = document.getElementById('result');
    const countdown = document.getElementById('countdown');
    const shiftLength = parseFloat(document.getElementById('shiftLength').value); // 9.5 or 4.5

    clearInterval(countdownInterval);

    let hours = null;
    let minutes = null;

    try {
        if (timeInput.includes(":")) {
            [hours, minutes] = timeInput.split(':').map(Number);
        } else {
            const chars = timeInput.split("");
            if (chars[0] == "0") {
                hours = chars[0] + chars[1];
                minutes = chars[2] + chars[3];
            } else {
                hours = chars[0];
                minutes = chars[1] + chars[2];
            }
        }

        const inTime = new Date();
        inTime.setHours(hours, minutes, 0);

        // shiftLength * 60 minutes
        const newTime = new Date(inTime.getTime() + (shiftLength * 60) * 60 * 1000);
        const now = new Date();
        const timeLeft = newTime - now;

        if (timeLeft < 0) throw new Error('Time is in the past.');

        result.innerHTML = `Estimated clock out time: ${newTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}`;
        result.style.color = '#79dda3'; // Green color

        countdownInterval = setInterval(() => updateCountdown(newTime), 1000);
    } catch (error) {
        result.innerHTML = error;
        result.style.color = '#d65b94'; // Red color
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
    document.getElementById('countdown').style.color = '#79dda3'; // Green color
}
