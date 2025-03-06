import moment from "moment-timezone";
import elements from "@/modules/elements";
import axios from "axios";
import { unsupportedTimeZones } from "@/data/timezones";
import type { cleanedTimeZone, fetchedTimeZone } from "@/types";
import { formatTime } from "@/utils/stopwatch.utils";
import storage from "@/utils/localStorage.util";
let intervalid: number | null = null;
const timeZones: cleanedTimeZone[] = storage.get<cleanedTimeZone[]>(
	"timeZones",
	[getUserLocalTime()]
)!;
elements.showTimeZone.addEventListener("click", showPopUp);
elements.overlay.addEventListener("click", hidePopUp);
elements.cancelTimeZone.addEventListener("click", hidePopUp);
elements.addTimeZone.addEventListener("click", async () => {
	let selectedTimeZone = elements.locationInput.getAttribute("timeZone")!;
	hidePopUp();
	elements.locationInput.value = "";
	elements.timeZones.innerHTML = `<h1 style="color: var(--font-color);">Updating Data...</h1>`;
	clearInterval(Number(intervalid));
	const data = await fetchTimeZone(selectedTimeZone);
	const cleanedData = cleanTimeZone(data);
	saveTimeZone(cleanedData);
	updateTimeZones();
	intervalid = window.setInterval(updateTimeZones, 30 * 1000);
});
elements.locationInput.addEventListener("input", (e) => {
	elements.locations.innerHTML = "";
	if (elements.locationInput.value.trim().length === 0) return;
	moment.tz.names().forEach((tz) => {
		if (unsupportedTimeZones.includes(tz)) return;
		if (
			!tz
				.toLowerCase()
				.includes(elements.locationInput.value.toLowerCase().trim())
		)
			return;
		const p = document.createElement("p");
		p.className = "location";
		p.setAttribute("timeZone", tz);
		p.setAttribute("tabindex", "0");
		const city = tz.split("/")[1].split("_").join(" ");
		const contintent = tz.split("/")[0];
		p.innerText = `${city}, ${contintent}`;
		elements.locations.appendChild(p);
		p.addEventListener("click", (e) => {
			elements.locationInput.value = p.innerText;
			elements.locationInput.setAttribute(
				"timeZone",
				p.getAttribute("timeZone")!
			);
			elements.locations.innerHTML = "";
		});
		p.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				elements.locationInput.value = p.innerText;
				elements.locationInput.setAttribute(
					"timeZone",
					p.getAttribute("timeZone")!
				);
				elements.locationInput.focus();
				elements.locations.innerHTML = "";
			}
		});
	});
	if (elements.locations.children.length === 0) {
		const p = document.createElement("p");
		p.className = "location";
		p.innerText = "Unavailable, Try a larger city nearby.";
		elements.locations.appendChild(p);
	}
});
async function fetchTimeZone(tz: string) {
	const continent = tz.split("/")[0];
	const city = tz.split("/")[1];
	const data: fetchedTimeZone = (
		await axios.get(
			`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`
		)
	).data;
	return data;
}
function cleanTimeZone(data: fetchedTimeZone) {
	const localTime = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate(),
		new Date().getHours(),
		new Date().getMinutes()
	);
	const fetchedTime = new Date(
		data.year,
		data.month - 1,
		data.day,
		data.hour,
		data.minute
	);
	const differenceBetweenLocal = Math.round(
		(localTime.getTime() - fetchedTime.getTime()) / 1000 / 3600
	);
	const time = moment(data.time, "HH:mm").format("hh:mm A");
	const cleanedData: cleanedTimeZone = {
		time,
		differenceBetweenLocal,
		date: data.date,
		timezonename: data.timeZone,
		cityName: data.timeZone.split("/")[1].split("_").join(" "),
		id: Date.now(),
		night: null,
	};
	return cleanedData;
}
function saveTimeZone(cleanedTimeZone: cleanedTimeZone) {
	const isDuplicated = timeZones.find(
		(tz) => tz.timezonename === cleanedTimeZone.timezonename
	);
	if (isDuplicated) return;
	timeZones.push(cleanedTimeZone);
	storage.set("timeZones", timeZones);
}
function renderTimeZones() {
	elements.timeZones.innerHTML = "";
	timeZones.forEach((tz) => {
		elements.timeZones.insertAdjacentHTML(
			"beforeend",
			`<div class="timezone">
				<div class="icon">
					<img src="./src/assets/svgs/${tz.night ? "moon" : "sun"}.svg" />
				</div>
				<span>${tz.time.split(" ")[0]} <small>${tz.time.split(" ")[1]}</small></span>
				<div>
					<h3>${tz.cityName}</h3>
					<small>${tz.date} ${
				!tz.differenceBetweenLocal
					? ""
					: tz.differenceBetweenLocal + " hr"
			}</small>
				</div>
			</div>`
		);
	});
}
function hidePopUp() {
	elements.popUp.classList.remove("opened");
	elements.overlay.classList.remove("opened");
}
function showPopUp() {
	elements.popUp.classList.add("opened");
	elements.overlay.classList.add("opened");
}
function updateTimeZones() {
	timeZones.forEach((tz) => {
		const time = new Date(
			Date.now() + tz.differenceBetweenLocal * 1000 * 3600
		);
		const formattedTime = time.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
		const isNight = time.getHours() >= 19 || time.getHours() < 6;
		tz.time = formattedTime;
		tz.night = isNight;
		renderTimeZones();
	});
	storage.set("timeZones", timeZones);
}
function getUserLocalTime(): cleanedTimeZone {
	const now = new Date();
	const formattedTime = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
	const formattedDate = now.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
	const isNight = now.getHours() >= 19 || now.getHours() < 6;
	const localTimeZone: cleanedTimeZone = {
		id: Date.now(),
		timezonename: "Local Time",
		differenceBetweenLocal: 0,
		date: formattedDate,
		time: formattedTime,
		cityName: "Local",
		night: isNight,
	};
	return localTimeZone;
}
updateTimeZones();
intervalid = window.setInterval(updateTimeZones, 30 * 1000);
