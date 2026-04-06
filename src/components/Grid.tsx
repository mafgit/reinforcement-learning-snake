"use client";

import { useEffect, useState, useRef, useEffectEvent } from "react";
import Cell from "./Cell";
import QLearning, { Action } from "@/services/model";
import { Direction } from "@/types/Direction";
import { CellLocation } from "@/types/CellLocation";
import Game from "@/services/game";
import { createGrid } from "@/utils/grid";
import { doesCellContainSnake, getRandomCell } from "@/utils/cell";
import Options from "./Options";

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

export default function Grid({
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
	const interval = useRef<NodeJS.Timeout | null>(null);
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

	const tick = useEffectEvent(() => {
		if (autoMode) {
			const updatedUI = model.run(game.current);

			updateUIAfterMove(updatedUI);
		} else {
			let queuedAction = nextActionQueue.current.shift();
			if (typeof queuedAction === "undefined") {
				queuedAction = Action.Continue;
			}

			const updatedUI = game.current.moveSnakeOneStep(queuedAction);

			updateUIAfterMove(updatedUI);
		}
	});

	const keyPressHandler = useEffectEvent((e: KeyboardEvent) => {
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
	});

	useEffect(() => {
		if (!gameOver) {
			if (!autoMode) window.addEventListener("keyup", keyPressHandler);
			else window.removeEventListener("keyup", keyPressHandler);
		}

		return () => {
			window.removeEventListener("keyup", keyPressHandler);
		};
	}, [autoMode, gameOver]);

	useEffect(() => {
		if (interval.current !== null) clearInterval(interval.current);
		if (!gameOver) {
			interval.current = setInterval(tick, 300);
		}
		return () => {
			if (interval.current !== null) clearInterval(interval.current);
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
		<main className="w-max max-w-screen mx-auto flex flex-col gap-2 p-2">
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

			<section
				style={{
					gridTemplateColumns: `repeat(${grid[0].length}, minmax(0px, 1fr))`,
				}}
				className={`grid gap-0 rounded-2xl h-max overflow-hidden transition-opacity duration-300 `}
			>
				{grid.map((row, r) =>
					row.map((_, c) => {
						const cellContainsSnake = doesCellContainSnake(
							snakeParts,
							r,
							c,
						);
						let isHead = false;
						let isTail = false;
						let isPartButNotHead = false; // for collision check

						if (cellContainsSnake) {
							isHead =
								snakeParts[0].r === r && snakeParts[0].c === c;

							isTail =
								snakeParts[snakeParts.length - 1].r === r &&
								snakeParts[snakeParts.length - 1].c === c;

							isPartButNotHead = !isHead;
						}

						return (
							<Cell
								key={r + "-" + c}
								cellContainsSnake={cellContainsSnake}
								isHead={isHead}
								isPartButNotHead={isPartButNotHead}
								isTail={isTail}
								isFood={food.r === r && food.c === c}
								autoMode={autoMode}
								r={r}
								c={c}
								setFood={setFood}
							/>
						);
					}),
				)}
			</section>
		</main>
	);
}
