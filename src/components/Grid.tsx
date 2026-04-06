import { CellLocation } from "@/types/CellLocation";
import { doesCellContainSnake } from "@/utils/cell";
import Cell from "./Cell";

interface Props {
	grid: null[][];
	snakeParts: CellLocation[];
	food: CellLocation;
	autoMode: boolean;
	setFood: React.Dispatch<React.SetStateAction<CellLocation>>;
}

const Grid = ({ grid, snakeParts, food, autoMode, setFood }: Props) => {
	return (
		<section
			style={{
				gridTemplateColumns: `repeat(${grid[0].length}, minmax(0px, 1fr))`,
			}}
			className={`grid gap-0 min-w-[290px] rounded-2xl h-max overflow-hidden transition-opacity duration-300 `}
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
						isHead = snakeParts[0].r === r && snakeParts[0].c === c;

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
	);
};

export default Grid;
