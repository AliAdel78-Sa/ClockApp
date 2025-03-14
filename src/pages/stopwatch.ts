// import storage from "@/utils/localStorage.util";
// import elements from "@/modules/elements";
// import type { Lap } from "@/types";
// import { formatTime } from "@/utils/stopwatch.utils";

// let startedTime = Number(storage.get("startedTime"));
// let running = storage.get("running") === "true";
// let intervalId: number | null = null;
// let elapsedTime: number = Number(storage.get("elapsedTime"));
// let totalPausedTime = Number(storage.get("totalPausedTime"));
// const laps = storage.get<Lap[]>("laps", [])!;

// elements.startBtn.addEventListener("click", startTimer);
// elements.pauseBtn.addEventListener("click", pauseTimer);
// elements.resetBtn.addEventListener("click", resetTimer);
// elements.lapBtn.addEventListener("click", addLap);
// elements.startBtn.addEventListener("keydown", (e) => {
// 	if (e.key === "Enter") {
// 		elements.startBtn.click();
// 		elements.pauseBtn.focus();
// 	}
// });
// elements.pauseBtn.addEventListener("keydown", (e) => {
// 	if (e.key === "Enter") {
// 		elements.pauseBtn.click();
// 		elements.startBtn.focus();
// 	}
// });
// elements.resetBtn.addEventListener("keydown", (e) => {
// 	if (e.key === "Enter") resetTimer();
// });
// elements.lapBtn.addEventListener("keydown", (e) => {
// 	if (e.key === "Enter") elements.lapBtn.click();
// });

// function updateLaps() {
// 	elements.lapTable.innerHTML = "";
// 	laps.forEach((lap, index) => {
// 		elements.lapTable.prepend(
// 			buildLap(
// 				String(index + 1),
// 				formatTime(lap.time),
// 				formatTime(lap.totalTime),
// 				false
// 			)
// 		);
// 	});
// 	elements.lapTable.prepend(buildLap("Laps", "Time", "Total", true));
// }
// function buildLap(
// 	index: string,
// 	time: string,
// 	totalTime: string,
// 	label: boolean
// ) {
// 	const lapElement = document.createElement("div");
// 	lapElement.className = `row ${label ? "header" : "test"}`;
// 	const lapIndex = document.createElement("div");
// 	const lapTime = document.createElement("div");
// 	const lapTotalTime = document.createElement("div");
// 	lapIndex.className = "col";
// 	lapTime.className = "col";
// 	lapTotalTime.className = "col";
// 	lapIndex.innerHTML = index;
// 	lapTime.innerHTML = time;
// 	lapTotalTime.innerHTML = totalTime;
// 	lapElement.append(lapIndex, lapTime, lapTotalTime);
// 	return lapElement;
// }
// function addLap() {
// 	if (!running) return;
// 	const totalTime =
// 		Date.now() -
// 		+storage.get("startedTime")! -
// 		+storage.get("totalPausedTime")!;
// 	const lastLap = laps[laps.length - 1];
// 	const lap: Lap = {
// 		date: Date.now(),
// 		totalTime,
// 		time: lastLap ? Date.now() - lastLap.date : totalTime,
// 	};
// 	laps.push(lap);
// 	updateLaps();
// 	storage.set("laps", laps);
// }
// function updateUI(status: "stop" | "start" | "reset") {
// 	switch (status) {
// 		case "stop":
// 			elements.startBtn.style.display = "flex";
// 			elements.pauseBtn.style.display = "none";
// 			elements.timerElement.style.color = "#cecece";
// 			elements.lapIcon.style.color = "#7b7b7b";
// 			break;
// 		case "start":
// 			elements.pauseBtn.style.display = "flex";
// 			elements.startBtn.style.display = "none";
// 			elements.timerElement.style.color = "#fefefe";
// 			elements.resetIcon.style.fill = "#fefefe";
// 			elements.lapIcon.style.color = "#fefefe";
// 			break;
// 		case "reset":
// 			elements.startBtn.style.display = "flex";
// 			elements.pauseBtn.style.display = "none";
// 			elements.timerElement.style.color = "#cecece";
// 			elements.resetIcon.style.fill = "#7b7b7b";
// 			elements.lapIcon.style.color = "#7b7b7b";
// 			break;
// 	}
// }
// function pauseTimer() {
// 	window.clearInterval(Number(intervalId));
// 	intervalId = null;
// 	running = false;
// 	storage.set("running", running);
// 	if (storage.get("startedTime") === null) return;
// 	if (!storage.get("lastPause")) {
// 		storage.set("lastPause", Date.now());
// 	}
// 	storage.set("elapsedTime", elapsedTime);
// 	updateUI("stop");
// }
// function updateTimer(startedTime: number, totalPausedTime: number) {
// 	elapsedTime = Date.now() - startedTime - totalPausedTime;
// 	elements.timerElement.innerHTML = formatTime(elapsedTime);
// }
// function startTimer() {
// 	running = true;
// 	storage.set("running", String(running));
// 	if (!startedTime) {
// 		startedTime = Date.now();
// 		storage.set("startedTime", Date.now());
// 	}
// 	if (storage.get("lastPause")) {
// 		totalPausedTime += Date.now() - Number(storage.get("lastPause"));
// 		storage.set("totalPausedTime", totalPausedTime);
// 		storage.remove("lastPause");
// 	}
// 	if (!intervalId) {
// 		intervalId = window.setInterval(
// 			() => updateTimer(startedTime, totalPausedTime),
// 			10
// 		);
// 	}
// 	updateUI("start");
// }
// function resetTimer() {
// 	window.clearInterval(Number(intervalId));
// 	intervalId = null;
// 	running = false;
// 	elements.timerElement.innerHTML = "00:00:00.00";
// 	storage.remove("running");
// 	storage.remove("startedTime");
// 	storage.remove("lastPause");
// 	storage.remove("elapsedTime");
// 	storage.remove("totalPausedTime");
// 	storage.remove("laps");
// 	totalPausedTime = 0;
// 	startedTime = 0;
// 	elapsedTime = 0;
// 	laps.length = 0;
// 	updateLaps();
// 	updateUI("reset");
// }

// elements.timerElement.innerHTML = formatTime(elapsedTime);
// if (running) startTimer();
// updateLaps();
