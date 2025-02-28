import elements from "../modules/elements";
import type { Lap } from "../types";
import { formatTime } from "../utils/stopwatch.utils";

let startedTime = Number(localStorage.getItem("startedTime") || null);
let running = localStorage.getItem("running") === "true";
let intervalId: number | null = null;
let elapsedTime: number = Number(localStorage.getItem("elapsedTime"));
let totalPausedTime = Number(localStorage.getItem("totalPausedTime"));
const laps: Lap[] = JSON.parse(
	localStorage.getItem("laps") || JSON.stringify([])
);
elements.startBtn.addEventListener("click", startTimer);
elements.pauseBtn.addEventListener("click", pauseTimer);
elements.resetBtn.addEventListener("click", resetTimer);
elements.startBtn.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		elements.startBtn.click();
		elements.pauseBtn.focus();
	}
});
elements.pauseBtn.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		elements.pauseBtn.click();
		elements.startBtn.focus();
	}
});
elements.resetBtn.addEventListener("keydown", (e) => {
	if (e.key === "Enter") resetTimer();
});
elements.lapBtn.addEventListener("click", () => {
	addLap();
	updateLaps();
});
elements.lapBtn.addEventListener("keydown", (e) => {
	if (e.key === "Enter") elements.lapBtn.click();
});

function updateLaps() {
	elements.lapTable.innerHTML = `<div class="row header">
		<div class="col">Laps</div>
		<div class="col">Time</div>
		<div class="col">Total</div>
	</div>`;
	laps.forEach((lap, index) => {
		const lapTemplate = `<div class="row test">
		<div class="col">${index + 1}</div>
		<div class="col">${formatTime(lap.time)}</div>
		<div class="col">${formatTime(lap.totalTime)}</div>
	</div>`;
		elements.lapTable.insertAdjacentHTML("beforeend", lapTemplate);
	});
}
function addLap() {
	if (!running) return;
	const totalTime =
		Date.now() -
		+localStorage.getItem("startedTime")! -
		+localStorage.getItem("totalPausedTime")!;
	const lastLap = laps[laps.length - 1];
	let time: number = 0;
	if (!lastLap) {
		time = totalTime;
	} else {
		time = Date.now() - lastLap.date;
	}

	const lap: Lap = {
		date: Date.now(),
		totalTime,
		time,
	};
	laps.push(lap);
	updateLaps();
	localStorage.setItem("laps", JSON.stringify(laps));
}
function updateUI(status: "stop" | "start" | "reset") {
	switch (status) {
		case "stop":
			elements.startBtn.style.display = "flex";
			elements.pauseBtn.style.display = "none";
			elements.timerElement.style.color = "#cecece";
			elements.lapIcon.style.color = "#7b7b7b";
			break;
		case "start":
			elements.pauseBtn.style.display = "flex";
			elements.startBtn.style.display = "none";
			elements.timerElement.style.color = "#fefefe";
			elements.resetIcon.style.fill = "#fefefe";
			elements.lapIcon.style.color = "#fefefe";
			break;
		case "reset":
			elements.startBtn.style.display = "flex";
			elements.pauseBtn.style.display = "none";
			elements.timerElement.style.color = "#cecece";
			elements.resetIcon.style.fill = "#7b7b7b";
			elements.lapIcon.style.color = "#7b7b7b";
			break;
	}
}
function pauseTimer() {
	clearInterval(Number(intervalId));
	intervalId = null;
	running = false;
	localStorage.setItem("running", String(running));
	if (localStorage.getItem("startedTime") === null) return;
	if (!localStorage.getItem("lastPause")) {
		localStorage.setItem("lastPause", String(Date.now()));
	}
	localStorage.setItem("elapsedTime", String(elapsedTime));
	updateUI("stop");
}
function updateTimer(startedTime: number, totalPausedTime: number) {
	elapsedTime = Date.now() - startedTime - totalPausedTime;
	elements.timerElement.innerHTML = formatTime(elapsedTime);
}
function startTimer() {
	running = true;
	localStorage.setItem("running", String(running));
	if (!startedTime) {
		startedTime = Date.now();
		localStorage.setItem("startedTime", String(Date.now()));
	}
	if (localStorage.getItem("lastPause")) {
		totalPausedTime +=
			Date.now() - Number(localStorage.getItem("lastPause"));
		localStorage.setItem("totalPausedTime", String(totalPausedTime));
		localStorage.removeItem("lastPause");
	}
	if (!intervalId) {
		intervalId = window.setInterval(
			() =>
				updateTimer(
					startedTime,
					Number(localStorage.getItem("totalPausedTime"))
				),
			10
		);
	}
	updateUI("start");
}
function resetTimer() {
	clearInterval(Number(intervalId));
	intervalId = null;
	running = false;
	elements.timerElement.innerHTML = "00:00:00.00";
	localStorage.removeItem("running");
	localStorage.removeItem("startedTime");
	localStorage.removeItem("lastPause");
	localStorage.removeItem("elapsedTime");
	localStorage.removeItem("totalPausedTime");
	localStorage.removeItem("laps");
	totalPausedTime = 0;
	startedTime = 0;
	elapsedTime = 0;
	laps.length = 0;
	updateLaps();
	updateUI("reset");
}

elements.timerElement.innerHTML = formatTime(elapsedTime);
if (running) startTimer();
updateLaps();
