export default {
	log(...args: unknown[]): void {
		console.log(...args);
	},
	error(...args: unknown[]): void {
		console.error(...args);
	},
	time(name: string): void {
		console.time(name);
	},
	timeEnd(name: string): void {
		console.timeEnd(name);
	},
};
