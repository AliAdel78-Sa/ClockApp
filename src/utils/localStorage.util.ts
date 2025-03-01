const storage = {
	get: <T>(key: string, alt?: T) => {
		const item = localStorage.getItem(key);
		return item === null ? (alt as T) : (JSON.parse(item) as T);
	},
	set: <T>(key: string, value: T) => {
		localStorage.setItem(key, JSON.stringify(value));
		console.log(`Key ${key} Was Set Successfully In LocalStorage`);
	},
	clear: () => {
		localStorage.clear();
		console.log(`LocalStorage Was Cleared Successfully`);
	},
	remove: (key: string) => {
		localStorage.removeItem(key);
		console.log(`Key ${key} Was Removed Successfully`);
	},
	size: (): string => {
		let total = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				const value = localStorage.getItem(key);
				total += key.length + (value?.length || 0);
			}
		}
		const sizeInKB = (total / 1024).toFixed(2);
		return `LocalStorage size: ${sizeInKB} KB`;
	},
};
export default storage;
