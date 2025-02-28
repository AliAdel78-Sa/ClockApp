import axios from "axios";
import moment from "moment-timezone";
import "./scss/main.scss";
import "./navigation";
const $ = (s: string) => document.querySelector(s) as HTMLElement;
let startedTime = Number(localStorage.getItem("startedTime") || null);
let running = localStorage.getItem("running") === "true";
let intervalId: number | null = null;
let elapsedTime: number = Number(localStorage.getItem("elapsedTime"));
let totalPausedTime = Number(localStorage.getItem("totalPausedTime"));
const timerElement = $("[timer-element]");
const startBtn = $("[start-btn]");
const pauseBtn = $("[pause-btn]");
const resetBtn = $("[reset-btn]");
const resetIcon = $("[reset-icon]");
const lapBtn = $("[lap-btn]");
const lapTable = $("[lap-table]");
const lapIcon = $("[lap-icon]");
startBtn?.addEventListener("click", startTimer);
pauseBtn?.addEventListener("click", pauseTimer);
resetBtn?.addEventListener("click", resetTimer);
startBtn?.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		startBtn.click();
		pauseBtn.focus();
	}
});
pauseBtn?.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		pauseBtn.click();
		startBtn.focus();
	}
});
resetBtn?.addEventListener("keydown", (e) => {
	if (e.key === "Enter") resetTimer();
});
lapBtn.addEventListener("click", () => {
	addLap();
	updateLaps();
});
lapBtn.addEventListener("keydown", (e) => {
	if (e.key === "Enter") lapBtn.click();
});
type Lap = {
	time: number;
	totalTime: number;
	date: number;
};
const laps: Lap[] = JSON.parse(
	localStorage.getItem("laps") || JSON.stringify([])
);
function updateLaps() {
	lapTable.innerHTML = `<div class="row header">
		<div class="col">Laps</div>
		<div class="col">Time</div>
		<div class="col">Total</div>
	</div>`;
	laps.forEach((lap, index) => {
		const lapTemplate = `<div class="row test">
		<div class="col">${index + 1}</div>
		<div class="col">${formatTime(lap.time, true)}</div>
		<div class="col">${formatTime(lap.totalTime, true)}</div>
	</div>`;
		lapTable.insertAdjacentHTML("beforeend", lapTemplate);
	});
}
function addLap() {
	// * Logic here...
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
			startBtn.style.display = "flex";
			pauseBtn.style.display = "none";
			timerElement.style.color = "#cecece";
			lapIcon.style.color = "#7b7b7b";
			break;
		case "start":
			pauseBtn.style.display = "flex";
			startBtn.style.display = "none";
			timerElement.style.color = "#fefefe";
			resetIcon.style.fill = "#fefefe";
			lapIcon.style.color = "#fefefe";
			break;
		case "reset":
			startBtn.style.display = "flex";
			pauseBtn.style.display = "none";
			timerElement.style.color = "#cecece";
			resetIcon.style.fill = "#7b7b7b";
			lapIcon.style.color = "#7b7b7b";
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
	timerElement!.innerHTML = formatTime(elapsedTime, true);
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
	timerElement!.innerHTML = "00:00:00.00";
	localStorage.removeItem("running");
	localStorage.removeItem("startedTime");
	localStorage.removeItem("lastPause");
	localStorage.removeItem("elapsedTime");
	localStorage.removeItem("totalPausedTime");
	totalPausedTime = 0;
	startedTime = 0;
	elapsedTime = 0;
	laps.length = 0;
	localStorage.removeItem("laps");
	updateLaps();
	updateUI("reset");
}
function formatTime(ms: number, showMs: boolean): string {
	const hours = Math.floor(ms / 3600000);
	const minutes = Math.floor((ms % 3600000) / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const centiseconds = Math.floor((ms % 1000) / 10);
	const pad = (num: number) => String(num).padStart(2, "0");
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${
		!showMs ? "" : `.${pad(centiseconds)}`
	}`;
}
timerElement!.innerHTML = formatTime(elapsedTime, true);
if (running) startTimer();
updateLaps();

/*
const unsupportedTimeZones: string[] = [
	"America/Argentina/Buenos_Aires",
	"America/Indiana/Indianapolis",
	"America/Kentucky/Louisville",
	"America/North_Dakota/Beulah",
	"CET",
	"CST6CDT",
	"Cuba",
	"EET",
	"EST",
	"EST5EDT",
	"Egypt",
	"Eire",
	"Etc/GMT+0",
	"Etc/GMT+1",
	"Etc/GMT+10",
	"Etc/GMT+11",
	"Etc/GMT+12",
	"Etc/GMT+2",
	"Etc/GMT+3",
	"Etc/GMT+4",
	"Etc/GMT+5",
	"Etc/GMT+6",
	"Etc/GMT+7",
	"Etc/GMT+8",
	"Etc/GMT+9",
	"GB",
	"GB-Eire",
	"GMT+0",
	"GMT",
	"GMT-0",
	"GMT0",
	"Greenwich",
	"HST",
	"Hongkong",
	"Iceland",
	"Israel",
	"Iran",
	"Jamaica",
	"Japan",
	"Kwajalein",
	"Libya",
	"MET",
	"MST",
	"MST7MDT",
	"NZ",
	"NZ-CHAT",
	"Navajo",
	"PRC",
	"PST8PDT",
	"Poland",
	"Portugal",
	"ROC",
	"ROK",
	"Singapore",
	"UCT",
	"Turkey",
	"W-SU",
	"UTC",
	"WET",
	"Universal",
	"Zulu",
	"America/Indiana/Knox",
	"America/Argentina/Catamarca",
	"America/Kentucky/Monticello",
	"America/North_Dakota/Center",
	"America/Indiana/Marengo",
	"America/Argentina/ComodRivadavia",
	"America/North_Dakota/New_Salem",
	"America/Indiana/Petersburg",
	"America/Argentina/Cordoba",
	"America/Indiana/Tell_City",
	"America/Argentina/Jujuy",
	"America/Indiana/Vevay",
	"America/Argentina/La_Rioja",
	"America/Indiana/Vincennes",
	"America/Argentina/Mendoza",
	"America/Indiana/Winamac",
	"America/Argentina/Rio_Gallegos",
	"America/Argentina/Salta",
	"America/Argentina/San_Juan",
	"America/Argentina/San_Luis",
	"America/Argentina/Tucuman",
	"America/Argentina/Ushuaia",
];
moment.tz.names().forEach(async (e) => {
	const continent = e.split("/")[0];
	const city = e.split("/")[1];
	if (unsupportedTimeZones.includes(e)) return;
	try {
		const { data } = await axios.get(
			`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`
		);
		// console.log(data);
	} catch (error) {
		axios.isAxiosError(error)
			? console.log(error.response?.data)
			: console.error("An unexpected error occurred:", error);
	}
});
*/
