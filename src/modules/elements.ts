/**
 *
 * @param s CSS Selector For The Element
 * @returns HTMLElement
 */

const $ = (s: string) => document.querySelector(s)! as HTMLElement;
const elements = {
	stopwatchElement: $("[stopwatch-element]"),
	startPauseBtn: $("#play-pause"),
	resetBtn: $("#reset"),
	resetIcon: $("[reset-icon]"),
	playPauseIcon: $("[play-pause-icon]"),
	lapBtn: $("#lap"),
	lapTable: $("[lap-table]"),
	lapsContainer: $("[laps-container]"),
	lapIcon: $("[lap-icon]"),
	nav: $("#nav"),
	navMenu: $("#menu"),
	overlay: $("[overlay]"),
	popUp: $("#pop-up"),
	showTimeZone: $("#show-timezone-btn"),
	editTimeZones: $("#edit-timezones-btn"),
	addTimeZone: $("[add-timezone-btn]"),
	cancelTimeZone: $("[cancel-timezone-btn]"),
	locationInput: $("#location-input") as HTMLInputElement,
	locations: $(".locations"),
	timeZones: $("[timeZones]"),
	hourHand: $(".hour"),
	minuteHand: $(".minute"),
	secondHand: $(".second"),
	timeZoneCity: $("[timezone-city]"),
	loader: $("#preloader"),
	timerElement: $("[timer-element]"),
	resetTimerBtn: $("[reset-timer-btn]"),
	playPauseTimerIcon: $("[play-pause-timer-icon]"),
	resetTimerIcon: $("[reset-timer-icon]"),
	progressBar: $("#progress-bar"),
	startPauseTimerBtn: $("[play-pause-timer]"),
};
export default elements;
