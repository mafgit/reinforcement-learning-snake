"use client";

import { useEffect, useState, useRef, useEffectEvent } from "react";
import Cell from "./Cell";
import QLearning from "@/services/model";
import { Direction } from "@/types/Direction";
import { CellLocation } from "@/types/CellLocation";
import Game from "@/services/game";
import { createGrid } from "@/utils/createGrid";
import { getRandomCell } from "@/utils/rand";
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

const eatingAudio = new Audio("/eating.mp3");
const hitAudio = new Audio("/hit.mp3");

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
	const nextDirectionQueue = useRef<Direction[]>([]);
	const [points, setPoints] = useState(0);

	const [food, setFood] = useState<CellLocation>(initFood);
	const headDirection = useRef<Direction>(initDirection);

	const [rowsState, setRowsState] = useState(initRows);
	const [colsState, setColsState] = useState(initCols);
	const rowsRef = useRef(initRows);
	const colsRef = useRef(initCols);
	const [grid, setGrid] = useState(createGrid(initRows, initCols));

	// [head, ..., ..., ..., tail]
	const [snakeParts, setSnakeParts] = useState<CellLocation[]>(initSnake);

	const game = useRef(new Game(5, 5, Direction.Right, snakeParts, food));

	function doesCellContainSnake(r: number, c: number) {
		for (let i = 0; i < snakeParts.length; i++) {
			if (snakeParts[i].r === r && snakeParts[i].c === c) {
				return true;
			}
		}

		return false;
	}

	useEffect(() => {
		console.log(food, game.current.food);
	}, [food]);

	const tick = useEffectEvent(() => {
		if (autoMode) {
			const { updatedSnake, ateFood, collided, newFood, newDirection } =
				model.run(game.current);
			setSnakeParts(updatedSnake);
			headDirection.current = newDirection;

			if (ateFood) {
				eatingAudio.play();
				if (newFood) setFood(newFood);
				setPoints((p) => p + 10);
			}

			if (collided) {
				hitAudio.play();
				setGameOver(true);
				// alert("Game over!");
			}
		} else {
			const queuedDirection = nextDirectionQueue.current.shift();
			if (typeof queuedDirection !== "undefined") {
				headDirection.current = queuedDirection;
			}
		}
	});

	const keyPressHandler = useEffectEvent((e: KeyboardEvent) => {
		if (e.key === "ArrowUp") {
			if (
				headDirection.current === Direction.Left ||
				headDirection.current === Direction.Right
			)
				nextDirectionQueue.current.push(Direction.Up);
		} else if (e.key === "ArrowRight") {
			if (
				headDirection.current === Direction.Up ||
				headDirection.current === Direction.Down
			)
				nextDirectionQueue.current.push(Direction.Right);
		} else if (e.key === "ArrowDown") {
			if (
				headDirection.current === Direction.Left ||
				headDirection.current === Direction.Right
			)
				nextDirectionQueue.current.push(Direction.Down);
		} else if (e.key === "ArrowLeft") {
			if (
				headDirection.current === Direction.Up ||
				headDirection.current === Direction.Down
			)
				nextDirectionQueue.current.push(Direction.Left);
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
		headDirection.current = initDirection;
		setGrid(createGrid(rowsRef.current, colsRef.current));
	}

	return (
		<main className="w-max max-w-screen mx-auto flex flex-col gap-2">
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
					gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
				}}
				className={`grid gap-0 rounded-2xl h-max  overflow-hidden transition-opacity duration-300 `}
			>
				{grid.map((row, r) =>
					row.map((_, c) => {
						const cellContainsSnake = doesCellContainSnake(r, c);
						let isHead = false;
						let isTail = false;

						if (cellContainsSnake) {
							isHead =
								snakeParts[0].r === r && snakeParts[0].c === c;

							isTail =
								snakeParts[snakeParts.length - 1].r === r &&
								snakeParts[snakeParts.length - 1].c === c;
						}

						return (
							<Cell
								key={r + "-" + c}
								cellContainsSnake={cellContainsSnake}
								isHead={isHead}
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
