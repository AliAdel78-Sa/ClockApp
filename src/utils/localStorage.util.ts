class LocalStorage {
	public get = <T>(key: string, alt: T): T => {
		try {
			const item = localStorage.getItem(key);
			return item !== null ? JSON.parse(item) : alt;
		} catch (error) {
			console.error("Local Storage Error:", error);
			return alt;
		}
	};
	public set = (key: string, value: unknown) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error("Local Storage Error:", error);
		}
	};
	public remove = (key: string) => {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error("Local Storage Error:", error);
		}
	};
	public clear = () => {
		try {
			localStorage.clear();
		} catch (error) {
			console.error("Local Storage Error:", error);
		}
	};
}
const storage = new LocalStorage();
export default storage;
