export default function Cell({
	isFood,
	cellContainsSnake,
	isHead,
}: {
	isFood: boolean;
	cellContainsSnake: boolean;
	isHead: boolean;
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
			className={
				`bg-white/50 aspect-square border ` +
				(!cellContainsSnake ? "border-black/10" : " border-transparent")
			}
		>
			<div
				className={
					"w-full h-full hover:opacity-90 transition-all text-xs p-2 duration-300 ease-out flex items-center justify-center " +
					additionalClasses
				}
			>
				{isFood ? "🍎" : ""}
			</div>
		</div>
	);
}
