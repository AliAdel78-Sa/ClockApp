import axios from "axios";
import moment from "moment-timezone";
import "./scss/main.scss";
import "./navigation";

type lap = {
	time: string;
	totalTime: string;
};

let initialLaps: unknown[] = [];
const laps: lap[] = JSON.parse(
	localStorage.getItem("laps") || JSON.stringify(initialLaps)
);

let startedTime = Number(localStorage.getItem("startedTime") || null);
let running = localStorage.getItem("running") === "true";
let intervalId: number | null = null;
let elapsedTime: number = Number(localStorage.getItem("elapsedTime"));
let totalPausedTime = Number(localStorage.getItem("totalPausedTime"));
const timerElement = document.querySelector("[timer-element]");
const startBtn = document.querySelector("[start-btn]");
const pauseBtn = document.querySelector("[pause-btn]");
const resetBtn = document.querySelector("[reset-btn]");
const lapsTable = document.querySelector("[laps-table]");
startBtn?.addEventListener("click", startTimer);
pauseBtn?.addEventListener("click", pauseTimer);
resetBtn?.addEventListener("click", resetTimer);

// TODO: ADD Laps Feature
function addLap() {
	let time: string = "00:00:00";
	const prevLap = laps[laps.length - 1];
	if (!prevLap) {
		time = formatTime(Date.now() - startedTime - totalPausedTime, false);
	}
}

function updateLaps() {
	lapsTable!.innerHTML = "";
	laps.forEach((lap, index) => {
		const tr = document.createElement("tr");
		const indexElement = document.createElement("td");
		const time = document.createElement("td");
		const totalTime = document.createElement("td");
		indexElement.innerHTML = String(index);
		time.innerHTML = String(lap.time);
		totalTime.innerHTML = String(lap.totalTime);
		tr.append(indexElement, time, totalTime);
		lapsTable!.prepend(tr);
	});
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
}
function updateTimer(startedTime: number, totalPausedTime: number) {
	elapsedTime = Date.now() - startedTime - totalPausedTime;
	timerElement!.innerHTML = formatTime(elapsedTime, true);
}

// prettier-ignore
const $ = (s: string, all?: boolean) => !all ? document.querySelector(s) as HTMLElement : document.querySelectorAll(s) as NodeListOf<HTMLElement>;

const elements = {
	element1: $(".element1"),
	element2: $(".element2"),
	element3: $(".element3"),
	element4: $(".element4"),
	element5: $(".element5"),
	element6: $(".element6"),
};

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
}
function resetTimer() {
	clearInterval(Number(intervalId));
	intervalId = null;
	running = false;
	timerElement!.innerHTML =
		"<span>00</span>:<span>00</span>:<span>00</span>.00";
	localStorage.removeItem("running");
	localStorage.removeItem("startedTime");
	localStorage.removeItem("lastPause");
	localStorage.removeItem("elapsedTime");
	localStorage.removeItem("totalPausedTime");
	totalPausedTime = 0;
	startedTime = 0;
	elapsedTime = 0;
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

const experienceStart = new Date(2024, 6, 24, 21, 40, 0);
function convertMilliseconds(ms: number) {
	const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
	const MS_IN_A_YEAR = MS_IN_A_DAY * 365.25;
	const MS_IN_A_MONTH = MS_IN_A_YEAR / 12;
	const years = Math.floor(ms / MS_IN_A_YEAR);
	ms %= MS_IN_A_YEAR;
	const months = Math.floor(ms / MS_IN_A_MONTH);
	ms %= MS_IN_A_MONTH;
	const days = Math.floor(ms / MS_IN_A_DAY);
	return { years, months, days };
}
console.log(convertMilliseconds(Date.now() - experienceStart.getTime()));

/*
function convertMilliseconds(ms: number) {
	const oneSecond = 1000;
	const oneMinute = oneSecond * 60;
	const oneHour = oneMinute * 60;
	const oneDay = oneHour * 24;
	const oneMonth = oneDay * 30.44;
	const oneYear = oneDay * 365.25;
	const years = Math.floor(ms / oneYear);
	ms %= oneYear;
	const months = Math.floor(ms / oneMonth);
	ms %= oneMonth;
	const days = Math.floor(ms / oneDay);
	ms %= oneDay;
	const hours = Math.floor(ms / oneHour);
	ms %= oneHour;
	const minutes = Math.floor(ms / oneMinute);
	ms %= oneMinute;
	const seconds = Math.floor(ms / oneSecond);
	ms %= oneSecond;
	return `${String(years).padStart(2, "0")}:${String(months).padStart(
		2,
		"0"
	)}:${String(days).padStart(2, "0")}:${String(hours).padStart(
		2,
		"0"
	)}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
		2,
		"0"
	)}.${String(ms).padStart(3, "0")}`;
}
*/
