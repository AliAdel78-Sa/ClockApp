import elements from "../modules/elements";

elements.navMenu.addEventListener("click", openNav);
elements.overlay.addEventListener("click", closeNav);

export function openNav() {
	elements.nav.classList.add("opened");
	elements.overlay.classList.add("opened");
}
export function closeNav() {
	elements.nav.classList.remove("opened");
	elements.overlay.classList.remove("opened");
}
