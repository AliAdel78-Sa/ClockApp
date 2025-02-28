export function formatTime(ms: number, showMs: boolean = true): string {
	const hours = Math.floor(ms / 3600000);
	const minutes = Math.floor((ms % 3600000) / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const centiseconds = Math.floor((ms % 1000) / 10);
	const pad = (num: number) => String(num).padStart(2, "0");
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${
		!showMs ? "" : `.${pad(centiseconds)}`
	}`;
}
