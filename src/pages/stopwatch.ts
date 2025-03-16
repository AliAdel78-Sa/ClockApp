import elements from "@/modules/elements";
import type { Lap } from "@/types";
import storage from "@/utils/localStorage.util";
import { formatTime } from "@/utils/stopwatch.utils";

const storageKeys = {
	STARTEDTIME: "startedTime",
	TOTALPAUSEDTIME: "totalPausedTime",
	ELAPSEDTIME: "elapsedTime",
	RUNNING: "running",
	LAPS: "laps",
	LASTPAUSE: "lastPause",
};
let startedTime = storage.get<number>(storageKeys.STARTEDTIME, 0);
let totalPausedTime = storage.get<number>(storageKeys.TOTALPAUSEDTIME, 0);
let elapsedTime = storage.get<number>(storageKeys.ELAPSEDTIME, 0);
let running = storage.get<boolean>(storageKeys.RUNNING, false);
let laps = storage.get<Lap[]>(storageKeys.LAPS, []);
let intervalId: number | null = null;

function startStopWatch() {
	running = true;
	storage.set(storageKeys.RUNNING, running);

	if (!startedTime) {
		startedTime = Date.now();
		storage.set(storageKeys.STARTEDTIME, startedTime);
	}

	if (storage.get<number>(storageKeys.LASTPAUSE, 0)) {
		totalPausedTime +=
			Date.now() - storage.get<number>(storageKeys.LASTPAUSE, 0);
		storage.set(storageKeys.TOTALPAUSEDTIME, totalPausedTime);
		storage.remove(storageKeys.LASTPAUSE);
	}

	if (!intervalId) {
		intervalId = window.setInterval(
			() => updateStopWatch(startedTime, totalPausedTime),
			10
		);
	}

	updateUI("start");
}
function stopStopWatch() {
	window.clearInterval(Number(intervalId));
	intervalId = null;
	running = false;
	storage.set(storageKeys.RUNNING, running);
	if (storage.get(storageKeys.STARTEDTIME, null) === null) return;
	if (!storage.get<number>(storageKeys.LASTPAUSE, 0)) {
		storage.set(storageKeys.LASTPAUSE, Date.now());
	}
	storage.set(storageKeys.ELAPSEDTIME, elapsedTime);
	updateUI("stop");
}
function resetStopWatch() {
	window.clearInterval(Number(intervalId));
	intervalId = null;
	running = false;
	elements.stopwatchElement.innerHTML = "00:00:00.00";
	storage.remove(storageKeys.RUNNING);
	storage.remove(storageKeys.STARTEDTIME);
	storage.remove(storageKeys.LASTPAUSE);
	storage.remove(storageKeys.ELAPSEDTIME);
	storage.remove(storageKeys.TOTALPAUSEDTIME);
	storage.remove(storageKeys.LAPS);
	totalPausedTime = 0;
	startedTime = 0;
	elapsedTime = 0;
	laps = [];
	updateLaps();
	updateUI("reset");
}
function updateUI(status: "stop" | "start" | "reset") {
	elements.playPauseIcon.className = `${
		status === "start" ? "bx bx-pause" : "bx bx-play"
	}`;
	elements.resetIcon.style.fill = `${
		status === "reset" ? "#7b7b7b" : "#fefefe"
	}`;
	elements.lapIcon.style.color = `${
		status === "start" ? "#fefefe" : "#7b7b7b"
	}`;
	elements.stopwatchElement.style.color = `${
		status === "start" ? "#fefefe" : "#cecece"
	}`;
	elements.playPauseIcon.style.transform = `${
		status === "start" ? "translateX(0px)" : "translateX(3px)"
	}`;
}
function updateStopWatch(startedTime: number, totalPausedTime: number) {
	elapsedTime = Date.now() - startedTime - totalPausedTime;
	elements.stopwatchElement.innerHTML = formatTime(elapsedTime);
}
function addLap() {
	if (!running) return;
	const totalTime =
		Date.now() -
		storage.get<number>(storageKeys.STARTEDTIME, 0) -
		storage.get<number>(storageKeys.TOTALPAUSEDTIME, 0);
	const lastLap = laps[laps.length - 1];
	const lap: Lap = {
		date: Date.now(),
		totalTime,
		time: lastLap ? Date.now() - lastLap.date : totalTime,
	};
	laps.push(lap);
	elements.lapsContainer.prepend(
		buildLap(laps.length - 1, lap.time, totalTime)
	);
	elements.lapTable.style.display = `${
		elements.lapsContainer.innerHTML === "" ? "none" : "block"
	}`;
	storage.set(storageKeys.LAPS, laps);
}
function buildLap(index: number, time: number, totalTime: number) {
	const lapElement = document.createElement("div");
	const lapIndex = document.createElement("div");
	const lapTime = document.createElement("div");
	const lapTotalTime = document.createElement("div");
	lapElement.className = "row";
	lapIndex.className = "col";
	lapTime.className = "col";
	lapTotalTime.className = "col";
	lapIndex.innerHTML = String(index + 1);
	lapTime.innerHTML = formatTime(time);
	lapTotalTime.innerHTML = formatTime(totalTime);
	lapElement.append(lapIndex, lapTime, lapTotalTime);
	return lapElement;
}
function updateLaps() {
	elements.lapsContainer.innerHTML = "";
	laps.forEach((lap, index) => {
		elements.lapsContainer.prepend(
			buildLap(index, lap.time, lap.totalTime)
		);
	});
	elements.lapTable.style.display = `${
		elements.lapsContainer.innerHTML === "" ? "none" : "block"
	}`;
}

elements.startPauseBtn.addEventListener("click", () =>
	running ? stopStopWatch() : startStopWatch()
);
elements.resetBtn.addEventListener("click", resetStopWatch);
elements.lapBtn.addEventListener("click", addLap);

elements.stopwatchElement.innerHTML = formatTime(elapsedTime);
if (running) {
	startStopWatch();
} else {
	if (storage.get<number>(storageKeys.STARTEDTIME, 0)) {
		updateUI("stop");
	} else {
		updateUI("reset");
	}
}
updateLaps();
