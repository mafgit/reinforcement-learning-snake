import { CellLocation } from "@/types/CellLocation";

export function doesCellContainSnake(
	snakeParts: CellLocation[],
	r: number,
	c: number,
) {
	for (let i = 0; i < snakeParts.length; i++) {
		if (snakeParts[i].r === r && snakeParts[i].c === c) {
			return true;
		}
	}

	return false;
}

export function getRandomCell(rows: number, cols: number) {
	return {
		r: Math.floor(Math.random() * rows),
		c: Math.floor(Math.random() * cols),
	};
}

export function getNewFood(
	snakeParts: CellLocation[],
	rows: number,
	cols: number,
) {
	let r = 2,
		c = 2;

	while (true) {
		({ r, c } = getRandomCell(rows, cols));
		if (!doesCellContainSnake(snakeParts, r, c)) break;
	}

	return { r, c };
}
