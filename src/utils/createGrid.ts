export function createGrid(rows: number, cols: number) {
	const grid = [];

	for (let i = 0; i < rows; i++) {
		const temp = [];
		for (let j = 0; j < cols; j++) {
			temp.push(null);
		}

		grid.push(temp);
	}

	return grid;
}
