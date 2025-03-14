import "./scss/main.scss";
import "@/modules/navigation";
import "@/pages/stopwatch.class";
import "@/ui/nav";
import "@/pages/world-clock";
import elements from "./modules/elements";

setTimeout(() => elements.loader.classList.add("hide"), 500);

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
let t = new Date(2030, 7, 8).getTime() - Date.now();
console.log(convertMilliseconds(t));

const days = t / 1000 / 60 / 1440;
console.log(days); // 1970 days...

// 5 years, 4 months, and 23 days...
