const storage = {
	get: <T>(key: string, alt: T | null = null): T | null => {
		try {
			const item = window.localStorage.getItem(key);
			console.error(`Key '${key}' Was Fetched Successfully`);
			return item === null ? (alt as T) : JSON.parse(item);
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
			return alt as T;
		}
	},
	set: (key: string, value: unknown) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
			console.error(`Key ${key} Was Set Successfully In LocalStorage`);
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
	clear: () => {
		try {
			window.localStorage.clear();
			console.error(`LocalStorage Was Cleared Successfully`);
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
	remove: (key: string) => {
		try {
			window.localStorage.removeItem(key);
			console.error(`Key ${key} Was Removed Successfully`);
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
			return `LocalStorage size: ${sizeInKB} KB`;
		} catch (error) {
			console.error(`Local Storage Error: ${error}`);
		}
	},
};
export default storage;
