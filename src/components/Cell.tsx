import { CellLocation } from "@/types/CellLocation";
import { Direction } from "@/types/Direction";

export default function Cell({
	isFood,
	cellContainsSnake,
	isHead,
	isPartButNotHead,
	r,
	c,
	headDirection,
	autoMode,
	updateFood,
	isTail,
}: {
	isFood: boolean;
	cellContainsSnake: boolean;
	isHead: boolean;
	isPartButNotHead: boolean;
	isTail: boolean;
	headDirection: Direction;
	r: number;
	updateFood: (c: CellLocation) => void;
	c: number;
	autoMode: boolean;
}) {
	let additionalClasses = "";

	if (cellContainsSnake) {
		if (isPartButNotHead) {
			if (isTail) {
				additionalClasses += "bg-green-600 rounded-3xl ";
			} else {
				additionalClasses += "bg-green-500 rounded-lg ";
			}
		}

		if (isHead) {
			additionalClasses += "bg-green-300 rounded-3xl ";
			// if (headDirection === Direction.Up) {
			// 	additionalClasses += " rounded-t-xl";
			// } else if (headDirection === Direction.Right) {
			// 	additionalClasses += " rounded-r-xl";
			// } else if (headDirection === Direction.Down) {
			// 	additionalClasses += " rounded-b-xl";
			// } else if (headDirection === Direction.Left) {
			// 	additionalClasses += " rounded-l-xl";
			// }
		}
	} else {
		additionalClasses += "rounded-lg ";
	}

	return (
		<div
			onClick={() => autoMode && updateFood({ r, c })}
			className={
				`bg-white/50 w-full flex items-center justify-center aspect-square border hover:opacity-90 border-black/10 `
				// + (!cellContainsSnake ? "border-black/10" : " border-transparent")
			}
		>
			<div
				className={
					"w-[75%] h-[75%] transition-all duration-300 ease-out flex items-center justify-center " +
					additionalClasses
				}
			>
				<p
					className={
						"transition-all duration-300 " +
						(isFood ? `opacity-90 scale-100` : `opacity-0 scale-0`)
					}
				>
					🍎
				</p>
			</div>
		</div>
	);
}
