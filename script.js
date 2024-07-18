let countdownInterval;

function exeCalTime(){
let key = event.key;
if(key == "Enter"){
calculateTime();
}
}

function calculateTime() {
    const timeInput = document.getElementById('timeInput').value;
    const result = document.getElementById('result');
    const countdown = document.getElementById('countdown');
	

    clearInterval(countdownInterval);

    let hours = null;
    let minutes = null;

    try {
	if(timeInput.includes(":")){
        [hours, minutes] = timeInput.split(':').map(Number);
	}else{
	const chars = timeInput.split("");
	if(chars[0] == "0"){
	hours = chars[0]+chars[1];
	minutes = chars[2]+chars[3];
	}else{
	hours = chars[0];
	minutes = chars[1]+chars[2];
	}
	}
        const inTime = new Date();
        inTime.setHours(hours, minutes, 0);

        const newTime = new Date(inTime.getTime() + (9 * 60 + 30) * 60 * 1000);
        const now = new Date();
        const timeLeft = newTime - now;

        if (timeLeft < 0) throw new Error('Time is in the past.');

        result.innerHTML = `Estimated clock out time: ${newTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}`;
        result.style.color = '#79dda3'; // Green color

        countdownInterval = setInterval(() => updateCountdown(newTime), 1000);
    } catch (error) {
        result.innerHTML = error;//'Invalid time format. Please enter time in HH:MM format.';
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

    document.getElementById('countdown').innerHTML = `Time left: ${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    document.getElementById('countdown').style.color = '#79dda3'; // Green color
}

function logTime() {
    const timeInput = document.getElementById('timeInput').value;
    const result = document.getElementById('result').innerHTML;

    if (!result) {
        document.getElementById('result').innerHTML = 'Please calculate time first.';
        document.getElementById('result').style.color = '#d65b94'; // Red color
        return;
    }

    const inTime = timeInput;
    const outTime = result.match(/Estimated clock out time: (\d{2}:\d{2}:\d{2} [AP]M)/)[1];
    const logDate = new Date().toISOString().split('T')[0];
    const logEntry = `${logDate},${inTime},${outTime}\n`;

    const file = new Blob([logEntry], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'time_log.csv';
    a.click();

    document.getElementById('result').innerHTML = 'Log saved successfully.';
    document.getElementById('result').style.color = '#8084e8'; // Purple color
}

function toggleLog() {
    const logTable = document.getElementById('logTable');
    if (logTable.style.display === 'none') {
        logTable.style.display = 'block';
        fetchLog();
    } else {
        logTable.style.display = 'none';
    }
}

function fetchLog() {
    fetch('time_log.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split('\n');
            let tableHtml = '<table><tr><th>Date</th><th>In Time</th><th>Out Time</th></tr>';
            rows.forEach(row => {
                const columns = row.split(',');
                tableHtml += `<tr><td>${columns[0]}</td><td>${columns[1]}</td><td>${columns[2]}</td></tr>`;
            });
            tableHtml += '</table>';
            document.getElementById('logTable').innerHTML = tableHtml;
        })
        .catch(() => {
            document.getElementById('logTable').innerHTML = '<p>No log file found.</p>';
        });
}
