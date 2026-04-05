import { CellLocation } from "@/types/CellLocation";
import { Dispatch, SetStateAction } from "react";

export default function Cell({
	isFood,
	cellContainsSnake,
	isHead,
	r,
	c,
	setFood,
	autoMode,
}: {
	isFood: boolean;
	cellContainsSnake: boolean;
	isHead: boolean;
	r: number;
	c: number;
	setFood: React.Dispatch<SetStateAction<CellLocation>>;
	autoMode: boolean;
}) {
	let additionalClasses = "";

	if (cellContainsSnake) {
		if (isHead) {
			additionalClasses += "bg-green-700 rounded-2xl";
			// if (headDirection === Direction.Up) {
			// 	additionalClasses += " rounded-t-xl";
			// } else if (headDirection === Direction.Right) {
			// 	additionalClasses += " rounded-r-xl";
			// } else if (headDirection === Direction.Down) {
			// 	additionalClasses += " rounded-b-xl";
			// } else if (headDirection === Direction.Left) {
			// 	additionalClasses += " rounded-l-xl";
			// }
		} else {
			additionalClasses += "bg-green-600 rounded-sm";
		}
	} else {
		additionalClasses += "rounded-sm";
	}

	return (
		<div
			onClick={() => autoMode && setFood({ r, c })}
			className={
				`bg-white/50 aspect-square border hover:opacity-90 ` +
				(!cellContainsSnake ? "border-black/10" : " border-transparent")
			}
		>
			<div
				className={
					"w-full h-full transition-all text-xs p-2 duration-300 ease-out flex items-center justify-center " +
					additionalClasses
				}
			>
				<p
					className={
						"transition-all duration-300 " +
						(isFood ? `opacity-100 scale-100` : `opacity-0 scale-0`)
					}
				>
					🍎
				</p>
			</div>
		</div>
	);
}
