/**
 *
 * @param s CSS Selector For The Element
 * @returns HTMLElement
 */

const $ = (s: string) => document.querySelector(s)! as HTMLElement;

const $a = (s: string) =>
	document.querySelectorAll(s)! as NodeListOf<HTMLElement>;

const elements = {
	timerElement: $("[timer-element]"),
	startBtn: $("[start-btn]"),
	pauseBtn: $("[pause-btn]"),
	resetBtn: $("[reset-btn]"),
	resetIcon: $("[reset-icon]"),
	lapBtn: $("[lap-btn]"),
	lapTable: $("[lap-table]"),
	lapIcon: $("[lap-icon]"),
	nav: $("#nav"),
	navMenu: $("#menu"),
	overlay: $("[overlay]"),
	popUp: $("#pop-up"),
	showTimeZone: $("#show-timezone-btn"),
	addTimeZone: $("[add-timezone-btn]"),
	cancelTimeZone: $("[cancel-timezone-btn]"),
	locationInput: $("#location-input") as HTMLInputElement,
	locations: $(".locations"),
	timeZones: $("[timeZones]"),
	hourHand: $(".hour"),
	minuteHand: $(".minute"),
	secondHand: $(".second"),
};
export default elements;
