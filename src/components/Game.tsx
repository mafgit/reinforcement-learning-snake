"use client";

import { useEffect, useState, useRef } from "react";
import QLearning, { Action } from "@/services/model";
import { Direction } from "@/types/Direction";
import { CellLocation } from "@/types/CellLocation";
import Game from "@/services/game";
import { createGrid } from "@/utils/grid";
import { getRandomCell } from "@/utils/cell";
import Options from "./Options";
import Grid from "./Grid";

const model = new QLearning();
const initDirection = Direction.Right;
const initRows = 5;
const initCols = 5;
const startPos = { r: 2, c: 2 };
// const initFood = getRandomCell(initRows, initCols);
const initFood = { r: 1, c: 1 };
const initSnake = [
	// { r: Math.floor(rows / 2), c: Math.floor(cols / 2) },
	startPos,
	{ ...startPos, c: startPos.c - 1 },
];

export default function GameComponent({
	autoMode,
	setAutoMode,
	gameOver,
	setGameOver,
}: {
	autoMode: boolean;
	setAutoMode: React.Dispatch<React.SetStateAction<boolean>>;
	gameOver: boolean;
	setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const nextActionQueue = useRef<Action[]>([]);
	const [points, setPoints] = useState(0);

	const [food, setFood] = useState<CellLocation>(initFood);

	const [rowsState, setRowsState] = useState(initRows);
	const [colsState, setColsState] = useState(initCols);
	const rowsRef = useRef(initRows);
	const colsRef = useRef(initCols);
	const [grid, setGrid] = useState(createGrid(initRows, initCols));

	// [head, ..., ..., ..., tail]
	const [snakeParts, setSnakeParts] = useState<CellLocation[]>(initSnake);

	const game = useRef(new Game(5, 5, Direction.Right, snakeParts, food));

	const eatingAudio = useRef<HTMLAudioElement | null>(null);
	const hitAudio = useRef<HTMLAudioElement | null>(null);

	const autoModeRef = useRef(true);

	useEffect(() => {
		eatingAudio.current = new Audio("eating.mp3");
		hitAudio.current = new Audio("hit.mp3");
	}, []);

	function updateUIAfterMove({
		updatedSnake,
		ateFood,
		collided,
		newFood,
	}: {
		updatedSnake: CellLocation[];
		ateFood: boolean;
		collided: boolean;
		newFood: CellLocation | null;
	}) {
		setSnakeParts(updatedSnake);

		if (ateFood) {
			eatingAudio.current?.play().catch(() => {});
			if (newFood) setFood(newFood);
			setPoints((p) => p + 10);
		}

		if (collided) {
			hitAudio.current?.play().catch(() => {});
			setGameOver(true);
		}
	}

	function tick() {
		if (timeout.current !== null) clearTimeout(timeout.current);

		if (!game.current.gameOver) {
			timeout.current = setTimeout(() => {
				if (autoModeRef.current) {
					const updatedUI = model.run(game.current);

					updateUIAfterMove(updatedUI);
				} else {
					let queuedAction = nextActionQueue.current.shift();
					if (typeof queuedAction === "undefined") {
						queuedAction = Action.Continue;
					}

					const updatedUI =
						game.current.moveSnakeOneStep(queuedAction);

					updateUIAfterMove(updatedUI);
				}

				tick();
			}, 300);
		}
	}

	function keyPressHandler(e: KeyboardEvent) {
		if (e.key === "ArrowUp") {
			if (game.current.headDirection === Direction.Right) {
				nextActionQueue.current.push(Action.Anticlockwise);
			} else if (game.current.headDirection === Direction.Left) {
				nextActionQueue.current.push(Action.Clockwise);
			}
		} else if (e.key === "ArrowRight") {
			if (game.current.headDirection === Direction.Up) {
				nextActionQueue.current.push(Action.Clockwise);
			} else if (game.current.headDirection === Direction.Down) {
				nextActionQueue.current.push(Action.Anticlockwise);
			}
		} else if (e.key === "ArrowDown") {
			if (game.current.headDirection === Direction.Right) {
				nextActionQueue.current.push(Action.Clockwise);
			} else if (game.current.headDirection === Direction.Left) {
				nextActionQueue.current.push(Action.Anticlockwise);
			}
		} else if (e.key === "ArrowLeft") {
			if (game.current.headDirection === Direction.Up) {
				nextActionQueue.current.push(Action.Anticlockwise);
			} else if (game.current.headDirection === Direction.Down) {
				nextActionQueue.current.push(Action.Clockwise);
			}
		}
	}

	useEffect(() => {
		if (!gameOver) {
			if (!autoMode) window.addEventListener("keyup", keyPressHandler);
			else window.removeEventListener("keyup", keyPressHandler);
		}

		autoModeRef.current = autoMode;

		return () => {
			window.removeEventListener("keyup", keyPressHandler);
		};
	}, [autoMode, gameOver]);

	function updateFood({ r, c }: CellLocation) {
		setFood({ r, c });
		game.current.updateFood({ r, c });
	}

	useEffect(() => {
		tick();

		return () => {
			if (timeout.current !== null) clearTimeout(timeout.current);
		};
	}, [gameOver]);

	function restartHandler() {
		setPoints(0);
		setGameOver(false);

		const newFood = getRandomCell(rowsState, colsState);
		game.current.restart(
			rowsState,
			colsState,
			newFood,
			initDirection,
			initSnake,
		);

		setFood(newFood);
		rowsRef.current = rowsState;
		colsRef.current = colsState;
		setGrid(createGrid(rowsRef.current, colsRef.current));
	}

	return (
		<main className="min-w-[290px] text-[#1c1c1c] flex flex-col items-center gap-2">
			<Options
				autoMode={autoMode}
				colsState={colsState}
				gameOver={gameOver}
				points={points}
				restartHandler={restartHandler}
				rowsState={rowsState}
				setAutoMode={setAutoMode}
				setColsState={setColsState}
				setRowsState={setRowsState}
			/>

			<Grid
				autoMode={autoMode}
				food={food}
				grid={grid}
				snakeParts={snakeParts}
				updateFood={updateFood}
			/>
		</main>
	);
}
