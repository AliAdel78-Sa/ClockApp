// TODO: ADD EDITING TIMER FUNCTIONALLITY

import elements from "@/modules/elements";
import storage from "@/utils/localStorage.util";
import { formatTime } from "@/utils/stopwatch.utils";

const storageKeys = {
  STARTEDTIME: "timerStartedTime",
  TOTALPAUSEDTIME: "timerTotalPausedTime",
  ELAPSEDTIME: "timerElapsedTime",
  RUNNING: "timerRunning",
  LASTPAUSE: "timerLastPause",
};
let startedTime = storage.get<number>(storageKeys.STARTEDTIME, 0);
let totalPausedTime = storage.get<number>(storageKeys.TOTALPAUSEDTIME, 0);
let elapsedTime = storage.get<number>(storageKeys.ELAPSEDTIME, 0);
let running = storage.get<boolean>(storageKeys.RUNNING, false);
let intervalId: number | null = null;
let targettedTime: number = 100000; // 359999000

function startStopWatch() {
  running = true;
  storage.set(storageKeys.RUNNING, running);

  if (!startedTime) {
    startedTime = Date.now();
    storage.set(storageKeys.STARTEDTIME, startedTime);
  }

  if (storage.get<number>(storageKeys.LASTPAUSE, 0)) {
    totalPausedTime += Date.now() - storage.get<number>(storageKeys.LASTPAUSE, 0);
    storage.set(storageKeys.TOTALPAUSEDTIME, totalPausedTime);
    storage.remove(storageKeys.LASTPAUSE);
  }

  if (!intervalId) {
    intervalId = window.setInterval(() => updateStopWatch(startedTime, totalPausedTime), 10);
  }

  updateUI("start");
}
function stopStopWatch() {
  window.clearInterval(Number(intervalId));
  intervalId = null;
  running = false;
  storage.set(storageKeys.RUNNING, running);
  if (storage.get(storageKeys.STARTEDTIME, null) === null) return;
  if (!storage.get<number>(storageKeys.LASTPAUSE, 0)) {
    storage.set(storageKeys.LASTPAUSE, Date.now());
  }
  storage.set(storageKeys.ELAPSEDTIME, elapsedTime);
  updateUI("stop");
}
function resetStopWatch() {
  window.clearInterval(Number(intervalId));
  intervalId = null;
  running = false;
  elements.timerElement.innerHTML = formatTime(targettedTime, false);
  storage.remove(storageKeys.RUNNING);
  storage.remove(storageKeys.STARTEDTIME);
  storage.remove(storageKeys.LASTPAUSE);
  storage.remove(storageKeys.ELAPSEDTIME);
  storage.remove(storageKeys.TOTALPAUSEDTIME);
  storage.remove("percentage");
  elements.progressBar.style.setProperty("--gradient-angle", 100 + "%");
  totalPausedTime = 0;
  startedTime = 0;
  elapsedTime = 0;
  updateUI("reset");
}
function updateUI(status: "stop" | "start" | "reset") {
  elements.playPauseTimerIcon.className = `${status === "start" ? "bx bx-pause" : "bx bx-play"}`;
  elements.resetTimerIcon.style.fill = `${status === "reset" ? "#7b7b7b" : "#fefefe"}`;
  elements.timerElement.style.color = `${status === "start" ? "#fefefe" : "#cecece"}`;
  elements.playPauseTimerIcon.style.transform = `${
    status === "start" ? "translateX(0px)" : "translateX(3px)"
  }`;
  elements.resetTimerBtn.style.cursor = `${status === "reset" ? "not-allowed" : "pointer"}`;
}
function updateStopWatch(startedTime: number, totalPausedTime: number) {
  elapsedTime = targettedTime - (Date.now() - startedTime - totalPausedTime);
  if (elapsedTime <= 0) {
    elements.timerElement.innerHTML = formatTime(0, false);
    clearInterval(Number(intervalId));
    elements.progressBar.style.setProperty("--gradient-angle", 0 + "%");
    return;
  }
  const percentage = Math.round((elapsedTime / targettedTime) * 100);
  elements.progressBar.style.setProperty("--gradient-angle", percentage + "%");
  storage.set("percentage", percentage);
  elements.timerElement.innerHTML = formatTime(elapsedTime, false);
}

elements.progressBar.style.setProperty("--gradient-angle", 100 + "%");
elements.startPauseTimerBtn.addEventListener("click", () =>
  running ? stopStopWatch() : startStopWatch()
);
elements.resetTimerBtn.addEventListener("click", resetStopWatch);
elements.timerElement.innerHTML = formatTime(
  targettedTime - elapsedTime <= 0 ? 0 : targettedTime - elapsedTime,
  false
);
if (running) {
  startStopWatch();
} else {
  if (storage.get<number>(storageKeys.STARTEDTIME, 0)) {
    const percentage = localStorage.getItem("percentage") || 0;
    elements.progressBar.style.setProperty("--gradient-angle", percentage + "%");
    updateUI("stop");
  } else {
    updateUI("reset");
  }
}

let x = 20;
