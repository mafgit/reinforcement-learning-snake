export function getRandomCell(rows: number, cols: number) {
	return {
		r: Math.floor(Math.random() * rows),
		c: Math.floor(Math.random() * rows),
	};
}
