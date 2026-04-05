import Grid from "@/components/Grid";

export default function Home() {
	const r = 5;
	const c = 5;
	const grid = [];

	for (let i = 0; i < c; i++) {
		const temp = [];
		for (let j = 0; j < r; j++) {
			temp.push(null);
		}

		grid.push(temp);
	}

	return (
		<div className="p-2">
			{r > 2 && c > 2 ? (
				<Grid grid={grid} />
			) : (
				<p>Both dimensions should be at least 3</p>
			)}
		</div>
	);
}
