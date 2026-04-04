"use client";

import { useEffect, useState, useRef } from "react";
import Cell from "./Cell";
import { moveSnake, runAction } from "@/utils/model";
import { Direction } from "@/types/Direction";
import { SnakePart } from "@/types/SnakePart";
import { getRandomCell } from "@/utils/rand";

interface Props {
	grid: null[][];
}

export default function Grid({ grid }: Props) {
	const [food, setFood] = useState({ r: 2, c: 2 });
	const interval = useRef<NodeJS.Timeout | null>(null);
	const [autoMode, setAutoMode] = useState(false);

	const rows = grid.length;
	const cols = grid[0].length;

	// [head, ..., ..., ..., tail]
	const startPos = { r: 3, c: 4 };
	const [snakeParts, setSnakeParts] = useState<SnakePart[]>([
		// { r: Math.floor(rows / 2), c: Math.floor(cols / 2) },
		startPos,
		{ ...startPos, c: startPos.c - 1 },
		{ ...startPos, c: startPos.c - 1 },
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

	function keyPressHandler(e: KeyboardEvent) {
		if (e.key === "ArrowUp") {
			if (
				headDirection.current === Direction.Left ||
				headDirection.current === Direction.Right
			)
				headDirection.current = Direction.Up;
		} else if (e.key === "ArrowRight") {
			if (
				headDirection.current === Direction.Up ||
				headDirection.current === Direction.Down
			)
				headDirection.current = Direction.Right;
		} else if (e.key === "ArrowDown") {
			if (
				headDirection.current === Direction.Left ||
				headDirection.current === Direction.Right
			)
				headDirection.current = Direction.Down;
		} else if (e.key === "ArrowLeft") {
			if (
				headDirection.current === Direction.Up ||
				headDirection.current === Direction.Down
			)
				headDirection.current = Direction.Left;
		}
	}

	useEffect(() => {
		if (!autoMode) window.addEventListener("keyup", keyPressHandler);
		else window.removeEventListener("keyup", keyPressHandler);

		return () => {
			window.removeEventListener("keyup", keyPressHandler);
		};
	}, [autoMode]);

	useEffect(() => {
		if (interval.current !== null) clearInterval(interval.current);

		function tick() {
			setSnakeParts((prevSnakeParts) => {
				const { updatedSnake, ateFood } = moveSnake(
					prevSnakeParts,
					headDirection.current,
					rows,
					cols,
					food,
				);

				if (ateFood) setFood(getRandomCell(rows, cols));

				return updatedSnake;
			});
			if (autoMode)
				headDirection.current = runAction(headDirection.current);
		}
		interval.current = setInterval(tick, 300);

		return () => {
			if (interval.current !== null) clearInterval(interval.current);
		};
	}, [autoMode, rows, cols]);

	return (
		<main>
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
							/>
						);
					}),
				)}
			</div>
		</main>
	);
}
