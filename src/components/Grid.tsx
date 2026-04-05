"use client";

import { useEffect, useState, useRef, useEffectEvent } from "react";
import Cell from "./Cell";
import QLearning from "@/services/model";
import { Direction } from "@/types/Direction";
import { CellLocation } from "@/types/CellLocation";
import Game from "@/services/game";
import { FaRedo } from "react-icons/fa";
import { createGrid } from "@/utils/createGrid";
import { getRandomCell } from "@/utils/rand";

const model = new QLearning();
const initDirection = Direction.Right;
const initRows = 5;
const initCols = 5;
const initFood = getRandomCell(initRows, initCols);
const startPos = { r: 2, c: 2 };
const initSnake = [
	// { r: Math.floor(rows / 2), c: Math.floor(cols / 2) },
	startPos,
	{ ...startPos, c: startPos.c - 1 },
];

export default function Grid() {
	const interval = useRef<NodeJS.Timeout | null>(null);
	const [autoMode, setAutoMode] = useState(true);
	const nextDirectionQueue = useRef<Direction[]>([]);
	const [gameOver, setGameOver] = useState(false);
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

	const tick = useEffectEvent(() => {
		if (autoMode) {
			const { updatedSnake, ateFood, collided, newFood, newDirection } =
				model.run(game.current);
			setSnakeParts(updatedSnake);
			headDirection.current = newDirection;

			if (ateFood) {
				if (newFood) setFood(newFood);
				setPoints((p) => p + 10);
			}

			if (collided) {
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
		<main className="w-max mx-auto flex flex-col gap-2">
			<div
				className={
					"rounded-2xl p-4 flex flex-col items-center gap-3 justify-center text-center " +
					(gameOver ? "bg-[#ffdd88]" : "bg-[#f3f3f3]")
				}
			>
				<div className="flex gap-2 items-center justify-center flex-wrap">
					<h1 className="text-2xl font-bold">RL SNAKE</h1>

					<div className="flex items-center border border-black/20 justify-center rounded-full bg-[#ebebeb]/80 overflow-hidden font-semibold text-xs">
						<button
							className={
								"px-2 py-1 cursor-pointer hover:opacity-80 transition-all duration-300 " +
								(autoMode
									? "bg-black text-white rounded-full"
									: "rounded-xs")
							}
							disabled={autoMode}
							onClick={() => setAutoMode(true)}
						>
							Auto
						</button>
						<button
							className={
								"px-2 py-1 cursor-pointer hover:opacity-80 transition-all duration-300 " +
								(!autoMode
									? "bg-black text-white rounded-full"
									: "rounded-xs")
							}
							disabled={!autoMode}
							onClick={() => setAutoMode(false)}
						>
							Manual
						</button>
					</div>
				</div>

				<div className="">
					<div className="">
						<label htmlFor="rows">Rows</label>
						<input
							id="rows"
							type="range"
							min={5}
							max={12}
							step={1}
							onChange={(e) =>
								setRowsState(parseInt(e.target.value))
							}
						/>
					</div>

					<div className="">
						<label htmlFor="cols">Rows</label>
						<input
							id="cols"
							type="range"
							min={5}
							max={12}
							step={1}
							onChange={(e) =>
								setColsState(parseInt(e.target.value))
							}
						/>
					</div>
				</div>
				<div className="flex items-center justify-center w-full gap-2">
					<p className="bg-amber-500 text-white font-semibold px-2 py-1 rounded-md">
						Points: {points}
					</p>

					{gameOver ? (
						<p className="font-semibold text-white flex-1 rounded-full bg-red-500/70 px-2 py-1 ">
							Game Over!
						</p>
					) : null}

					<button
						aria-label="Restart"
						onClick={restartHandler}
						className="bg-blue-400 font-semibold text-white p-2 rounded-md cursor-pointer"
					>
						<FaRedo />
					</button>
				</div>
			</div>

			<div
				style={{
					gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
				}}
				className={
					`grid gap-0 rounded-2xl h-max max-h-[95vh] overflow-hidden transition-opacity duration-300 ` +
					(gameOver ? "opacity-80" : "opacity-100")
				}
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
			</div>
		</main>
	);
}
