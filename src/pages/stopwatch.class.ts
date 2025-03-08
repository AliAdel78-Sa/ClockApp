import elements from "@/modules/elements";
import type { Lap } from "@/types";
import storage from "@/utils/localStorage.util";
import { formatTime } from "@/utils/stopwatch.utils";

/**
 * StopWatchSystem - A class that implements a stopwatch with lap functionality
 *
 * Features:
 * - Persistent state storage
 * - Lap tracking
 * - Pause/Resume functionality
 * - UI synchronization
 */
export class StopWatchSystem {
	/** Storage key mappings for persistent data */
	private storageKeys = {
		STARTEDTIME: "startedTime", // When the stopwatch first started
		TOTALPAUSEDTIME: "totalPausedTime", // Cumulative pause duration
		ELAPSEDTIME: "elapsedTime", // Total time elapsed
		RUNNING: "running", // Current running state
		LAPS: "laps", // Stored lap data
		LASTPAUSE: "lastPause", // Timestamp of last pause
	};

	/** Timestamp when the stopwatch was started */
	private startedTime: number = storage.get(this.storageKeys.STARTEDTIME)!;

	/** Total time spent in paused state */
	private totalPausedTime: number = storage.get(
		this.storageKeys.TOTALPAUSEDTIME
	)!;

	/** Current elapsed time */
	public elapsedTime: number = storage.get(this.storageKeys.ELAPSEDTIME)!;

	/** Current running state */
	public running: boolean = storage.get(this.storageKeys.RUNNING)!;

	/** Array of recorded laps */
	private laps = storage.get<Lap[]>(this.storageKeys.LAPS, [])!;

	/** Reference to the update interval timer */
	private intervalId: number | null = null;

	/**
	 * @param startedTimeKeyName - Custom storage key for the start time
	 * @param totalPausedTimeKeyName - Custom storage key for total pause duration
	 * @param elapsedTimeKeyName - Custom storage key for elapsed time
	 * @param runningKeyName - Custom storage key for running state
	 * @param lapsKeyName - Custom storage key for lap data
	 * @param lastPauseKeyName - Custom storage key for last pause timestamp
	 *
	 * This allows multiple stopwatch instances to use different storage keys.
	 */
	constructor(
		startedTimeKeyName?: string,
		totalPausedTimeKeyName?: string,
		elapsedTimeKeyName?: string,
		runningKeyName?: string,
		lapsKeyName?: string,
		lastPauseKeyName?: string
	) {
		if (startedTimeKeyName) {
			this.storageKeys.STARTEDTIME = startedTimeKeyName;
		}
		if (totalPausedTimeKeyName) {
			this.storageKeys.TOTALPAUSEDTIME = totalPausedTimeKeyName;
		}
		if (elapsedTimeKeyName) {
			this.storageKeys.ELAPSEDTIME = elapsedTimeKeyName;
		}
		if (runningKeyName) {
			this.storageKeys.RUNNING = runningKeyName;
		}
		if (lapsKeyName) {
			this.storageKeys.LAPS = lapsKeyName;
		}
		if (lastPauseKeyName) {
			this.storageKeys.LASTPAUSE = lastPauseKeyName;
		}
	}

	/**
	 * Starts or resumes the stopwatch
	 * - Updates running state
	 * - Calculates pause duration if resuming
	 * - Initializes the update interval
	 */
	public startStopWatch = () => {
		// Set running state and persist it
		this.running = true;
		storage.set(this.storageKeys.RUNNING, String(this.running));

		// Initialize start time if first start
		if (!this.startedTime) {
			this.startedTime = Date.now();
			storage.set(this.storageKeys.STARTEDTIME, Date.now());
		}

		// Calculate pause duration if resuming
		if (storage.get(this.storageKeys.LASTPAUSE)) {
			this.totalPausedTime +=
				Date.now() - Number(storage.get(this.storageKeys.LASTPAUSE));
			storage.set(this.storageKeys.TOTALPAUSEDTIME, this.totalPausedTime);
			storage.remove(this.storageKeys.LASTPAUSE);
		}

		// Start the update interval if not already running
		if (!this.intervalId) {
			this.intervalId = window.setInterval(
				() =>
					this.updateStopWatch(
						this.startedTime,
						this.totalPausedTime
					),
				10 // Update every 10ms for smooth display
			);
		}

		this.updateUI("start");
	};

	/**
	 * Stops/pauses the stopwatch
	 * - Clears the update interval
	 * - Stores the pause timestamp
	 * - Updates UI to paused state
	 */
	public stopStopWatch = () => {
		window.clearInterval(Number(this.intervalId));
		this.intervalId = null;
		this.running = false;
		storage.set(this.storageKeys.RUNNING, this.running);
		if (storage.get(this.storageKeys.STARTEDTIME) === null) return;
		if (!storage.get(this.storageKeys.LASTPAUSE)) {
			storage.set(this.storageKeys.LASTPAUSE, Date.now());
		}
		storage.set(this.storageKeys.ELAPSEDTIME, this.elapsedTime);
		this.updateUI("stop");
	};

	/**
	 * Resets the stopwatch to initial state
	 * - Clears all timers and stored values
	 * - Resets UI elements
	 * - Clears lap history
	 */
	public resetStopWatch = () => {
		window.clearInterval(Number(this.intervalId));
		this.intervalId = null;
		this.running = false;
		elements.timerElement.innerHTML = "00:00:00.00";
		storage.remove(this.storageKeys.RUNNING);
		storage.remove(this.storageKeys.STARTEDTIME);
		storage.remove(this.storageKeys.LASTPAUSE);
		storage.remove(this.storageKeys.ELAPSEDTIME);
		storage.remove(this.storageKeys.TOTALPAUSEDTIME);
		storage.remove(this.storageKeys.LAPS);
		this.totalPausedTime = 0;
		this.startedTime = 0;
		this.elapsedTime = 0;
		this.laps = [];
		this.updateLaps();
		this.updateUI("reset");
	};

	/**
	 * Updates UI elements based on stopwatch state
	 * @param status - Current stopwatch status
	 * Controls visibility and styling of:
	 * - Start/pause buttons
	 * - Timer display
	 * - Lap and reset icons
	 */
	public updateUI = (status: "stop" | "start" | "reset") => {
		switch (status) {
			case "stop":
				elements.playPauseIcon.className = "bx bx-play";
				elements.resetIcon.style.fill = "#fefefe";
				elements.playPauseIcon.style.transform = "translateX(3px)";
				elements.timerElement.style.color = "#cecece";
				elements.lapIcon.style.color = "#7b7b7b";
				break;
			case "start":
				elements.playPauseIcon.className = "bx bx-pause";
				elements.playPauseIcon.style.transform = "translateX(0px)";
				elements.timerElement.style.color = "#fefefe";
				elements.resetIcon.style.fill = "#fefefe";
				elements.lapIcon.style.color = "#fefefe";
				break;
			case "reset":
				elements.playPauseIcon.className = "bx bx-play";
				elements.playPauseIcon.style.transform = "translateX(3px)";
				elements.timerElement.style.color = "#cecece";
				elements.resetIcon.style.fill = "#7b7b7b";
				elements.lapIcon.style.color = "#7b7b7b";
				break;
		}
	};

	/**
	 * Updates the stopwatch display
	 * @param startedTime - Initial start timestamp
	 * @param totalPausedTime - Cumulative pause duration
	 * Calculates current elapsed time and updates display
	 */
	private updateStopWatch = (
		startedTime: number,
		totalPausedTime: number
	) => {
		this.elapsedTime = Date.now() - startedTime - totalPausedTime;
		elements.timerElement.innerHTML = formatTime(this.elapsedTime);
	};

	/**
	 * Adds a new lap entry
	 * - Calculates lap and total times
	 * - Updates lap history
	 * - Persists lap data
	 * - Updates lap display
	 */
	public addLap = () => {
		if (!this.running) return;
		const totalTime =
			Date.now() -
			+storage.get(this.storageKeys.STARTEDTIME)! -
			+storage.get(this.storageKeys.TOTALPAUSEDTIME)!;
		const lastLap = this.laps[this.laps.length - 1];
		const lap: Lap = {
			date: Date.now(),
			totalTime,
			time: lastLap ? Date.now() - lastLap.date : totalTime,
		};
		this.laps.push(lap);
		elements.lapsContainer.prepend(
			this.buildLap(this.laps.length - 1, lap.time, totalTime)
		);
		elements.lapTable.style.display = `${
			elements.lapsContainer.innerHTML === "" ? "none" : "block"
		}`;
		storage.set(this.storageKeys.LAPS, this.laps);
	};

	/**
	 * Creates a DOM element for a lap entry
	 * @param index - Lap number/index
	 * @param time - Lap duration
	 * @param totalTime - Total time
	 * @returns HTMLDivElement representing the lap row
	 */
	private buildLap = (index: number, time: number, totalTime: number) => {
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
	};

	/**
	 * Updates the lap table display
	 * - Clears existing lap entries
	 * - Rebuilds table with current lap data
	 * - Adds header row
	 */
	public updateLaps = () => {
		elements.lapsContainer.innerHTML = "";
		this.laps.forEach((lap, index) => {
			elements.lapsContainer.prepend(
				this.buildLap(index, lap.time, lap.totalTime)
			);
		});
		elements.lapTable.style.display = `${
			elements.lapsContainer.innerHTML === "" ? "none" : "block"
		}`;
	};
}

// Stop Watch Instance
const stopWatch = new StopWatchSystem();

// Events:
elements.startPauseBtn.addEventListener("click", () => {
	if (stopWatch.running) {
		stopWatch.stopStopWatch();
		stopWatch.updateUI("stop");
	} else {
		stopWatch.startStopWatch();
		stopWatch.updateUI("start");
	}
});
elements.resetBtn.addEventListener("click", stopWatch.resetStopWatch);
elements.lapBtn.addEventListener("click", stopWatch.addLap);

// Initial Running State
elements.timerElement.innerHTML = formatTime(stopWatch.elapsedTime);
if (stopWatch.running) {
	stopWatch.startStopWatch();
} else {
	if (storage.get("startedTime")) {
		stopWatch.updateUI("stop");
	} else {
		stopWatch.updateUI("reset");
	}
}
stopWatch.updateLaps();
