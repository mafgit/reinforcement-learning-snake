"use client";

import { useEffect, useState, useRef, useEffectEvent } from "react";
import Cell from "./Cell";
import { moveSnake, runAction } from "@/utils/model";
import { Direction } from "@/types/Direction";
import { getRandomCell } from "@/utils/rand";
import { CellLocation } from "@/types/CellLocation";

interface Props {
	grid: null[][];
}

export default function Grid({ grid }: Props) {
	const [food, setFood] = useState<CellLocation>({ r: 2, c: 2 });
	const interval = useRef<NodeJS.Timeout | null>(null);
	const [autoMode, setAutoMode] = useState(true);
	const nextDirectionQueue = useRef<Direction[]>([]);
	const [gameOver, setGameOver] = useState(false);
	const [points, setPoints] = useState(0);

	const rows = grid.length;
	const cols = grid[0].length;

	// [head, ..., ..., ..., tail]
	const startPos = { r: 3, c: 4 };
	const [snakeParts, setSnakeParts] = useState<CellLocation[]>([
		// { r: Math.floor(rows / 2), c: Math.floor(cols / 2) },
		startPos,
		{ ...startPos, c: startPos.c - 1 },
		{ ...startPos, c: startPos.c - 2 },
	]);

	const headDirection = useRef<Direction>(Direction.Right);

	function doesCellContainSnake(r: number, c: number) {
		for (let i = 0; i < snakeParts.length; i++) {
			if (snakeParts[i].r === r && snakeParts[i].c === c) {
				return true;
			}
		}

		return false;
	}

	const tick = useEffectEvent(() => {
		setSnakeParts((prevSnakeParts) => {
			const { updatedSnake, ateFood, collided } = moveSnake(
				prevSnakeParts,
				headDirection.current,
				rows,
				cols,
				food,
			);

			if (ateFood) {
				setFood(getRandomCell(rows, cols));
				setPoints((p) => p + 10);
			}

			if (collided) {
				setGameOver(true);
				alert("Game over!");
			}
			return updatedSnake;
		});

		if (autoMode) headDirection.current = runAction(headDirection.current);
		else {
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

	return (
		<main>
			<p>Points: {points}</p>
			<div
				style={{
					gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
				}}
				className={`grid gap-0 rounded-lg w-max h-max max-h-[95vh] overflow-hidden min-w-[40vw]`}
			>
				{grid.map((row, r) =>
					row.map((_, c) => {
						const cellContainsSnake = doesCellContainSnake(r, c);
						let isHead = false;

						if (cellContainsSnake) {
							isHead =
								snakeParts[0].r === r && snakeParts[0].c === c;
						}

						return (
							<Cell
								key={r + "-" + c}
								cellContainsSnake={cellContainsSnake}
								isHead={isHead}
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
