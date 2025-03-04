import { LocalStorage } from "@/types";

const storage: LocalStorage = {
	get: <T>(key: string, alt: T | null = null) => {
		try {
			const item = window.localStorage.getItem(key);
			return item !== null ? (JSON.parse(item) as T) : alt;
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
			return alt;
		}
	},
	set: (key: string, value: unknown) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
	clear: () => {
		try {
			window.localStorage.clear();
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
	remove: (key: string) => {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
	size: () => {
		try {
			let total = 0;
			for (let i = 0; i < window.localStorage.length; i++) {
				const key = window.localStorage.key(i);
				if (key) {
					const value = window.localStorage.getItem(key);
					total += key.length + (value?.length || 0);
				}
			}
			const sizeInKB = (total / 1024).toFixed(2);
			console.log(`LocalStorage size: ${sizeInKB} KB`);
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
};
export default storage;
