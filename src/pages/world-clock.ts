import moment from "moment-timezone";
import elements from "@/modules/elements";
import axios from "axios";
import { unsupportedTimeZones } from "@/data/timezones";
import type { TimeZones } from "@/types";
import { formatTime } from "@/utils/stopwatch.utils";
import storage from "@/utils/localStorage.util";
const timeZones: string[] = storage.get<string[]>("timeZones", [])!;

elements.showTimeZone.addEventListener("click", showPopUp);
elements.overlay.addEventListener("click", hidePopUp);
elements.cancelTimeZone.addEventListener("click", hidePopUp);
elements.addTimeZone.addEventListener("click", () => {
	let selectedTimeZone = elements.locationInput.getAttribute("timeZone")!;
	if (!timeZones.includes(selectedTimeZone)) timeZones.push();
	elements.locationInput.value = "";
	storage.set("timeZones", timeZones);
	hidePopUp();
	updateTimeZones();
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
		p.innerText = tz.split("/").reverse().join(", ");
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
function hidePopUp() {
	elements.popUp.classList.remove("opened");
	elements.overlay.classList.remove("opened");
}
function showPopUp() {
	elements.popUp.classList.add("opened");
	elements.overlay.classList.add("opened");
}

function updateTimeZones() {
	timeZones.forEach(async (tz) => {
		const continent = tz.split("/")[0];
		const city = tz.split("/")[1];
		if (unsupportedTimeZones.includes(tz)) return;
		try {
			const data: TimeZones = (
				await axios.get(
					`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`
				)
			).data;
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
			console.log(data);
			console.log(
				formatTime(localTime.getTime() - fetchedTime.getTime())
			);
		} catch (error) {
			axios.isAxiosError(error)
				? console.log(error.response?.data)
				: console.error("An unexpected error occurred:", error);
		}
	});
}
updateTimeZones();
