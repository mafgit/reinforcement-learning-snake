import { CellLocation } from "@/types/CellLocation";
import { Action } from "./model";
import { Direction, directions } from "@/types/Direction";
import { getRandomCell } from "../utils/cell";

export default class Game {
	headDirection: number;
	snakeParts: CellLocation[];
	rows: number;
	cols: number;
	gameOver: boolean;
	food: CellLocation;

	constructor(
		rows: number,
		cols: number,
		headDirection: Direction,
		snakeParts: CellLocation[],
		food: CellLocation,
	) {
		this.headDirection = headDirection;
		this.snakeParts = snakeParts;
		this.rows = rows;
		this.cols = cols;
		this.food = food;
		this.gameOver = false;
	}

	private turnHeadDirection(action: Action) {
		let newDirection = this.headDirection;

		switch (action) {
			case Action.Clockwise:
				newDirection = this.headDirection + 1;
				if (newDirection >= directions.length) {
					newDirection = 0;
				}
				break;
			case Action.Anticlockwise:
				newDirection = this.headDirection - 1;
				if (newDirection < 0) {
					newDirection = directions.length - 1;
				}
				break;
			case Action.Continue:
				break;
		}

		this.headDirection = newDirection;
		return newDirection;
	}

	restart(
		r: number,
		c: number,
		f: CellLocation,
		d: Direction,
		s: CellLocation[],
	) {
		this.rows = r;
		this.cols = c;
		this.food = f;
		this.headDirection = d;
		this.snakeParts = s;
		this.gameOver = false;
	}

	moveSnakeOneStep(action: Action) {
		this.turnHeadDirection(action);

		// move head forward only
		const oldHead = { ...this.snakeParts[0] };
		const updatedHead = { ...oldHead };

		switch (this.headDirection) {
			case Direction.Up:
				updatedHead.r -= 1;
				if (updatedHead.r < 0) {
					updatedHead.r = this.rows - 1;
				}
				break;

			case Direction.Right:
				updatedHead.c += 1;
				if (updatedHead.c >= this.cols) {
					updatedHead.c = 0;
				}
				break;

			case Direction.Down:
				updatedHead.r += 1;
				if (updatedHead.r >= this.rows) {
					updatedHead.r = 0;
				}
				break;

			case Direction.Left:
				updatedHead.c -= 1;
				if (updatedHead.c < 0) {
					updatedHead.c = this.cols - 1;
				}
				break;

			default:
				throw new Error("Invalid direction");
		}

		const ateFood =
			updatedHead.r === this.food.r && updatedHead.c === this.food.c;

		let newFood: null | CellLocation = null;
		let updatedSnake;
		if (!ateFood) {
			updatedSnake = [updatedHead, ...this.snakeParts.slice(0, -1)];
		} else {
			updatedSnake = [updatedHead, ...this.snakeParts];
			newFood = getRandomCell(this.rows, this.cols);
			this.food = newFood;
		}

		// collided check (if updated head direction is one away from any other part while also direction is towards it)
		const rest = updatedSnake.slice(1);
		let collided = false;

		for (const part of rest) {
			if (updatedHead.r - part.r === 0 && updatedHead.c === part.c) {
				collided = true;
				this.gameOver = true;
				break;
			}
		}

		this.snakeParts = updatedSnake;
		return { updatedSnake, ateFood, collided, newFood };
	}

	updateFood({ r, c }: CellLocation) {
		this.food = { r, c };
	}

	getCurrentState() {
		let dangerAhead = false;
		let dangerToRight = false;
		let dangerToLeft = false;

		const head = this.snakeParts[0];
		const rest = this.snakeParts.slice(1);

		if (this.headDirection === Direction.Up) {
			for (const part of rest) {
				if (!dangerAhead)
					dangerAhead =
						part.c === head.c &&
						(head.r - 1 + this.rows) % this.rows === part.r;
				if (!dangerToRight)
					dangerToRight =
						part.r === head.r &&
						(head.c + 1) % this.cols === part.c;
				if (!dangerToLeft)
					dangerToLeft =
						part.r === head.r &&
						(head.c - 1 + this.cols) % this.cols === part.c;
			}
		} else if (this.headDirection === Direction.Right) {
			for (const part of rest) {
				if (!dangerAhead)
					dangerAhead =
						part.r === head.r &&
						(head.c + 1) % this.cols === part.c;
				if (!dangerToRight)
					dangerToRight =
						part.r === head.r &&
						(head.c - 1 + this.cols) % this.cols === part.c;
				if (!dangerToLeft)
					dangerToLeft =
						part.c === head.c &&
						(head.r - 1 + this.rows) % this.rows === part.r;
			}
		} else if (this.headDirection === Direction.Down) {
			for (const part of rest) {
				if (!dangerAhead)
					dangerAhead =
						part.c === head.c &&
						(head.r + 1) % this.rows === part.r;
				if (!dangerToRight)
					dangerToRight =
						part.r === head.r &&
						(head.c - 1 + this.cols) % this.cols === part.c;
				if (!dangerToLeft)
					dangerToLeft =
						part.r === head.r &&
						(head.c + 1) % this.cols === part.c;
			}
		} else if (this.headDirection === Direction.Left) {
			for (const part of rest) {
				if (!dangerAhead)
					dangerAhead =
						part.r === head.r &&
						(head.c - 1 + this.cols) % this.cols === part.c;
				if (!dangerToRight)
					dangerToRight =
						part.r === head.r &&
						(head.c + 1) % this.cols === part.c;
				if (!dangerToLeft)
					dangerToLeft =
						part.c === head.c &&
						(head.r + 1) % this.rows === part.r;
			}
		}

		let foodAhead = false;
		let foodToRight = false;
		// let foodBehind;
		// let foodToLeft;

		if (this.headDirection === Direction.Up) {
			foodAhead = head.r > this.food.r;
			foodToRight = head.c > this.food.c;
			// foodBehind = head.r < this.food.r;
			// foodToLeft = head.c < this.food.c;
		} else if (this.headDirection === Direction.Right) {
			foodAhead = this.food.c > head.c;
			foodToRight = this.food.r > head.r;
		} else if (this.headDirection === Direction.Down) {
			foodAhead = head.r < this.food.r;
			foodToRight = head.c < this.food.c;
		} else if (this.headDirection === Direction.Left) {
			foodAhead = this.food.c < head.c;
			foodToRight = this.food.r < head.r;
		}

		return [
			// head direction
			this.headDirection === Direction.Up,
			this.headDirection === Direction.Right,
			this.headDirection === Direction.Down,
			this.headDirection === Direction.Left,

			// collision
			dangerAhead,
			dangerToRight,
			dangerToLeft,

			// food
			foodAhead,
			foodToRight,
			!foodAhead,
			!foodToRight,
		];
	}
}
