import { closeNav } from "@/ui/nav";

const $ = (s: string) => document.querySelector(s)! as HTMLElement;
const $A = (s: string) =>
	document.querySelectorAll(s)! as NodeListOf<HTMLElement>;

const navLinks = $A(".nav-link")!;
const activeElement = $(".active-element")!;
const pages = $A(".page")!;

navLinks.forEach((navLink) => {
	navLink.addEventListener("click", () => {
		closeNav();
		const navLinkPage = navLink.getAttribute("data-link")!;
		const currentActivePage = $(`.page.active[data-link=${navLinkPage}]`);
		const { top } = navLink.getBoundingClientRect();
		activeElement.style.top = top + 12 + "px";
		unActiveAllLinks();
		unShowAllPages();
		navLink.classList.add("active");
		const page = $(`.page[data-link=${navLinkPage}]`);
		page.classList.add("active");
		if (!currentActivePage) {
			page.style.animationName = "goUp";
			setTimeout(() => (page.style.animationName = ""), 500);
		}
	});
	navLink.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			navLink.click();
		}
	});
});

function unActiveAllLinks() {
	navLinks.forEach((n) => n.classList.remove("active"));
}

function unShowAllPages() {
	pages.forEach((p) => p.classList.remove("active"));
}
