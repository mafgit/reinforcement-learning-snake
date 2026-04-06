import { CellLocation } from "@/types/CellLocation";
import { getRandomCell } from "./cell";
import { getRandInRange } from "./rand";
import { Direction } from "@/types/Direction";
import { maxColsTraining, maxRowsTraining, minCols, minRows } from "@/constants/dimensions";

export function getRandomGameStart() {
	const rows = getRandInRange(minRows, maxRowsTraining);
	const cols = getRandInRange(minCols, maxColsTraining);
	const food: CellLocation = getRandomCell(rows, cols);
	const headDirection = [Direction.Up, Direction.Right, Direction.Left][
		Math.floor(Math.random() * 3)
	];

	const startPos = getRandomCell(rows, cols);
	const snakeParts: CellLocation[] = [
		startPos,
		{ ...startPos, r: (startPos.r + 1) % rows },
	];

	return { rows, cols, food, snakeParts, headDirection };
}
