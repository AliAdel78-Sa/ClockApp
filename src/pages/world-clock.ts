import moment from "moment-timezone";
import elements from "@/modules/elements";
import axios from "axios";
import type { cleanedTimeZone, fetchedTimeZone } from "@/types";
import storage from "@/utils/localStorage.util";
import { timezoneMappings, unsupportedTimeZones } from "../data/timezones";
import { formatTime } from "@/utils/stopwatch.utils";
let timeZonesTimeId: number | null = null;
let analogClockId: number | null = null;
let timeZones: cleanedTimeZone[] = storage.get<cleanedTimeZone[]>("timeZones", [
	getUserLocalTime(),
])!;
elements.showTimeZone.addEventListener("click", showPopUp);
elements.overlay.addEventListener("click", hidePopUp);
elements.cancelTimeZone.addEventListener("click", hidePopUp);
elements.addTimeZone.addEventListener("click", async () => {
	let selectedTimeZone = elements.locationInput.getAttribute("timeZone")!;
	hidePopUp();
	elements.locationInput.value = "";
	elements.timeZones.innerHTML = `<h1 style="color: var(--font-color);">Updating Data...</h1>`;
	clearInterval(Number(timeZonesTimeId));
	const data = await fetchTimeZone(selectedTimeZone);
	const cleanedData = cleanTimeZone(data);
	saveTimeZone(cleanedData);
	updateTimeZones();
	timeZonesTimeId = window.setInterval(updateTimeZones, 30 * 1000);
});
elements.locationInput.addEventListener("input", (e) => {
	const value = elements.locationInput.value.toLowerCase().trim();
	elements.locations.innerHTML = "";
	if (elements.locationInput.value.trim().length === 0) return;
	for (const tz in timezoneMappings) {
		if (unsupportedTimeZones.includes(tz)) continue;
		if (!timezoneMappings[tz].join("").toLowerCase().includes(value))
			continue;
		const p = document.createElement("p");
		p.className = "location";
		p.setAttribute("timeZone", tz);
		p.setAttribute("tabindex", "0");
		p.innerText = timezoneMappings[tz].join(", ");
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
	}
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
			`<div class="timezone" differenceBetweenLocal="${
				tz.differenceBetweenLocal
			}" timeZoneCityName="${tz.cityName}" tabindex="0">
				<div id="${tz.id}" class="icon delete-timezone-icon">
					<img src="../../svgs/${tz.night ? "moon" : "sun"}.svg" alt="" />
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
	(
		document.querySelectorAll(".timezone")! as NodeListOf<HTMLElement>
	).forEach((tz) => {
		tz.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				elements.timeZoneCity.innerHTML =
					tz.getAttribute("timeZoneCityName")!;
				clearInterval(+analogClockId!);
				updateTime(
					new Date(
						Date.now() +
							+tz.getAttribute("differenceBetweenLocal")! *
								1000 *
								3600
					)
				);
				analogClockId = window.setInterval(
					() =>
						updateTime(
							new Date(
								Date.now() +
									+tz.getAttribute(
										"differenceBetweenLocal"
									)! *
										1000 *
										3600
							)
						),
					1000
				);
			}
		});
		tz.addEventListener("click", () => {
			elements.timeZoneCity.innerHTML =
				tz.getAttribute("timeZoneCityName")!;
			clearInterval(+analogClockId!);
			updateTime(
				new Date(
					Date.now() +
						+tz.getAttribute("differenceBetweenLocal")! *
							1000 *
							3600
				)
			);
			analogClockId = window.setInterval(
				() =>
					updateTime(
						new Date(
							Date.now() +
								+tz.getAttribute("differenceBetweenLocal")! *
									1000 *
									3600
						)
					),
				1000
			);
		});
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
function updateTime(date: Date) {
	let s = date.getSeconds() * 6; // 6° per second
	let m = date.getMinutes() * 6 + date.getSeconds() * 0.1; // 6° per min + 0.1° per sec
	let h =
		(date.getHours() % 12) * 30 +
		date.getMinutes() * 0.5 +
		date.getSeconds() * (1 / 120);
	// 30° per hour + 0.5° per min + 1/120° per sec
	elements.secondHand.style.transform = `rotate(${s}deg)`;
	elements.minuteHand.style.transform = `rotate(${m}deg)`;
	elements.hourHand.style.transform = `rotate(${h}deg)`;
}
elements.timeZoneCity.innerHTML = "Local";
updateTime(
	new Date(Date.now() + timeZones[0].differenceBetweenLocal * 1000 * 3600)
);
updateTimeZones();
analogClockId = window.setInterval(
	() =>
		updateTime(
			new Date(
				Date.now() + timeZones[0].differenceBetweenLocal * 1000 * 3600
			)
		),
	1000
);
timeZonesTimeId = window.setInterval(updateTimeZones, 30 * 1000);

elements.editTimeZones.addEventListener("click", (e) => {
	elements.editTimeZones.classList.toggle("editing");
	if (elements.editTimeZones.classList.contains("editing")) {
	} else {
	}
});
// select all delete btns
// select all icons
// toggle hide/visiblity of those
// add click to the delete buttons
// delete timezone from the storage of the same id
// render the timezones

const m = new Map<string, unknown>();
