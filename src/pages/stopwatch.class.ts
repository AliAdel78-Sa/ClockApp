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
	public storageKeys = {
		STARTEDTIME: "startedTime", // When the stopwatch first started
		TOTALPAUSEDTIME: "totalPausedTime", // Cumulative pause duration
		ELAPSEDTIME: "elapsedTime", // Total time elapsed
		RUNNING: "running", // Current running state
		LAPS: "laps", // Stored lap data
		LASTPAUSE: "lastPause", // Timestamp of last pause
	};

	/** Timestamp when the stopwatch was started */
	private startedTime = storage.get<number>(this.storageKeys.STARTEDTIME, 0);

	/** Total time spent in paused state */
	private totalPausedTime = storage.get<number>(
		this.storageKeys.TOTALPAUSEDTIME,
		0
	);

	/** Current elapsed time */
	public elapsedTime = storage.get<number>(this.storageKeys.ELAPSEDTIME, 0);

	/** Current running state */
	public running = storage.get<boolean>(this.storageKeys.RUNNING, false);

	/** Array of recorded laps */
	private laps = storage.get<Lap[]>(this.storageKeys.LAPS, []);

	/** Reference to the update interval timer */
	private intervalId: number | null = null;

	/**
	 * Starts or resumes the stopwatch
	 * - Updates running state
	 * - Calculates pause duration if resuming
	 * - Initializes the update interval
	 */
	public startStopWatch = () => {
		// Set running state and persist it
		this.running = true;
		storage.set(this.storageKeys.RUNNING, this.running);

		// Initialize start time if first start
		if (!this.startedTime) {
			this.startedTime = Date.now();
			storage.set(this.storageKeys.STARTEDTIME, Date.now());
		}

		// Calculate pause duration if resuming
		if (storage.get<number>(this.storageKeys.LASTPAUSE, 0)) {
			this.totalPausedTime +=
				Date.now() - storage.get<number>(this.storageKeys.LASTPAUSE, 0);
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
		if (storage.get(this.storageKeys.STARTEDTIME, null) === null) return;
		if (!storage.get<number>(this.storageKeys.LASTPAUSE, 0)) {
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
		elements.playPauseIcon.className = `${
			status === "start" ? "bx bx-pause" : "bx bx-play"
		}`;
		elements.resetIcon.style.fill = `${
			status === "reset" ? "#7b7b7b" : "#fefefe"
		}`;
		elements.lapIcon.style.color = `${
			status === "start" ? "#fefefe" : "#7b7b7b"
		}`;
		elements.timerElement.style.color = `${
			status === "start" ? "#fefefe" : "#cecece"
		}`;
		elements.playPauseIcon.style.transform = `${
			status === "start" ? "translateX(0px)" : "translateX(3px)"
		}`;
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
			storage.get<number>(this.storageKeys.STARTEDTIME, 0) -
			storage.get<number>(this.storageKeys.TOTALPAUSEDTIME, 0);
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

// Events:
const stopWatch = new StopWatchSystem();
elements.startPauseBtn.addEventListener("click", () =>
	stopWatch.running ? stopWatch.stopStopWatch() : stopWatch.startStopWatch()
);
elements.resetBtn.addEventListener("click", stopWatch.resetStopWatch);
elements.lapBtn.addEventListener("click", stopWatch.addLap);

// Initial Running State
elements.timerElement.innerHTML = formatTime(stopWatch.elapsedTime);
if (stopWatch.running) {
	stopWatch.startStopWatch();
} else {
	if (storage.get<number>(stopWatch.storageKeys.STARTEDTIME, 0)) {
		stopWatch.updateUI("stop");
	} else {
		stopWatch.updateUI("reset");
	}
}
stopWatch.updateLaps();
