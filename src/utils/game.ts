import { CellLocation } from "@/types/CellLocation";
import { getNewFood, getRandomCell } from "./cell";
import { getRandInRange } from "./rand";
import { Direction } from "@/types/Direction";
import {
	maxColsTraining,
	maxRowsTraining,
	minCols,
	minRows,
} from "@/constants/dimensions";

export function getRandomGameStart() {
	const rows = getRandInRange(minRows, maxRowsTraining);
	const cols = getRandInRange(minCols, maxColsTraining);
	const headDirection = [Direction.Up, Direction.Right, Direction.Left][
		Math.floor(Math.random() * 3)
	];

	const startPos = getRandomCell(rows, cols);
	const snakeParts: CellLocation[] = [
		startPos,
		{ ...startPos, r: (startPos.r + 1) % rows },
	];
	const food: CellLocation = getNewFood(snakeParts, rows, cols);

	return { rows, cols, food, snakeParts, headDirection };
}
