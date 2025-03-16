import "./scss/main.scss";
import "@/modules/navigation";
import "@/ui/nav";
import "@/pages/stopwatch";
import "@/pages/world-clock";
import "@/pages/timer";
import elements from "@/modules/elements";
setTimeout(() => elements.loader.classList.add("hide"), 500);

function formatDuration(ms: number) {
	const seconds = Math.floor(ms / 1000) % 60;
	const minutes = Math.floor(ms / (1000 * 60)) % 60;
	const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
	const days = Math.floor(ms / (1000 * 60 * 60 * 24)) % 30;
	const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30)) % 12;
	const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	return `${years}y ${months}mo ${days}d ${hours}h ${minutes}m ${seconds}s`;
}



handlingImportantDates();
setInterval(handlingImportantDates, 1000);
function handlingImportantDates() {
	const experienceStart =
		Date.now() - new Date(2024, 6, 24, 21, 40, 0).getTime();
	const loveStarted = Date.now() - new Date(2021, 9, 10, 8, 0, 0).getTime();
	const marrying = new Date(2030, 7, 8).getTime() - Date.now();
	// document.querySelector(`[test-element]`)!.textContent =
	// 	formatDuration(marrying);
}
