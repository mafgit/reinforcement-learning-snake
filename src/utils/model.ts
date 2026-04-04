import { Direction, directions } from "@/types/Direction";
import { SnakePart } from "@/types/SnakePart";

export enum Action {
	Continue = 0,
	Clockwise,
	Anticlockwise,
}

const actions = [Action.Continue, Action.Clockwise, Action.Anticlockwise];

export function getAction(): Action {
	const action = actions[Math.floor(Math.random() * actions.length)];
	return action;
}

export function runAction(headDirection: Direction) {
	const action = getAction();

	let newDirection = headDirection;

	switch (action) {
		case Action.Clockwise:
			newDirection = headDirection + 1;
			if (newDirection >= directions.length) {
				newDirection = 0;
			}
			break;
		case Action.Anticlockwise:
			newDirection = headDirection - 1;
			if (newDirection < 0) {
				newDirection = directions.length - 1;
			}
			break;
		case Action.Continue:
			break;
	}

	return newDirection;
}

export function moveSnake(
	prevSnakeParts: SnakePart[],
	headDirection: Direction,
	rows: number,
	cols: number,
	food: { r: number; c: number },
) {
	// move head forward only
	const oldHead = { ...prevSnakeParts[0] };
	const updatedHead = { ...oldHead };

	switch (headDirection) {
		case Direction.Up:
			updatedHead.r -= 1;
			if (updatedHead.r < 0) {
				updatedHead.r = rows - 1;
			}
			break;

		case Direction.Right:
			updatedHead.c += 1;
			if (updatedHead.c >= cols) {
				updatedHead.c = 0;
			}
			break;

		case Direction.Down:
			updatedHead.r += 1;
			if (updatedHead.r >= rows) {
				updatedHead.r = 0;
			}
			break;

		case Direction.Left:
			updatedHead.c -= 1;
			if (updatedHead.c < 0) {
				updatedHead.c = cols - 1;
			}
			break;

		default:
			throw new Error("Invalid direction");
	}

	// const updatedSnake = [updatedHead];

	// // rest of the part follows each empty space ahead
	// let follow = { ...oldHead };
	// const rest = prevSnakeParts.slice(1);

	// for (let i = 0; i < rest.length; i++) {
	// 	let part = { ...rest[i] };

	// 	// swap
	// 	const temp = { ...part };
	// 	part = { ...follow };
	// 	follow = { ...temp };

	// 	updatedSnake.push(part);
	// }

	// updatedSnake.pop();

	const updatedSnake = [updatedHead, ...prevSnakeParts.slice(0, -1)];

	let ateFood = false;
	if (updatedHead.r === food.r && updatedHead.c === food.c) ateFood = true;

	return { updatedSnake, ateFood };
}
