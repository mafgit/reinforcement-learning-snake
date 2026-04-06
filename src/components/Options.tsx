import { maxCols, maxRows, minCols, minRows } from "@/constants/dimensions";
import { FaPlay, FaRedo, FaStop } from "react-icons/fa";

interface Props {
	gameOver: boolean;
	autoMode: boolean;
	setAutoMode: React.Dispatch<React.SetStateAction<boolean>>;
	rowsState: number;
	setRowsState: React.Dispatch<React.SetStateAction<number>>;
	colsState: number;
	setColsState: React.Dispatch<React.SetStateAction<number>>;
	restartHandler: () => void;
	points: number;
	stopped: boolean;
	resume: () => void;
	stop: () => void;
}

const Options = ({
	gameOver,
	autoMode,
	setAutoMode,
	rowsState,
	setRowsState,
	colsState,
	setColsState,
	restartHandler,
	stop,
	resume,
	stopped,
	points,
}: Props) => {
	return (
		<header
			// style={{
			// 	// width: "minmax(80vw, 700px)"
			// }}
			className="w-full rounded-2xl p-4 flex flex-col items-center gap-3 justify-center text-center bg-[#f3f3f3]/70 "
		>
			<div className="flex gap-3 flex-col items-center justify-center flex-wrap">
				<h1 className="text-2xl font-bold">RL SNAKE</h1>

				<div className="flex items-center border border-black/20 justify-center rounded-full bg-[#ebebeb]/80 overflow-hidden font-semibold text-sm">
					<button
						className={
							"px-4 py-1 cursor-pointer hover:opacity-80 transition-all outline-none duration-300 " +
							(autoMode
								? "bg-black text-white rounded-full"
								: "rounded-xs")
						}
						disabled={autoMode}
						onClick={() => setAutoMode(true)}
					>
						AI
					</button>
					<button
						className={
							"px-2 py-1 cursor-pointer hover:opacity-80 transition-all outline-none duration-300 " +
							(!autoMode
								? "bg-black text-white rounded-full"
								: "rounded-xs")
						}
						disabled={!autoMode}
						onClick={() => setAutoMode(false)}
					>
						MANUAL
					</button>
				</div>

				{!autoMode ? (
					<p className="text-xs text-gray-800">
						(Manual works with a keyboard)
					</p>
				) : null}
			</div>

			<div className="w-full">
				<div className="flex items-center text-sm justify-between gap-2 ">
					<label htmlFor="rows">ROWS</label>
					<div className="flex gap-2">
						<input
							id="rows"
							type="range"
							min={minRows}
							value={rowsState}
							max={maxRows}
							step={1}
							onChange={(e) =>
								setRowsState(parseInt(e.target.value))
							}
						/>
						<p>{rowsState}</p>
					</div>
				</div>

				<div className="flex items-center text-sm justify-between gap-2 ">
					<label htmlFor="cols">COLUMNS</label>
					<div className="flex gap-2">
						<input
							id="cols"
							type="range"
							value={colsState}
							min={minCols}
							max={maxCols}
							step={1}
							onChange={(e) =>
								setColsState(parseInt(e.target.value))
							}
						/>
						<p>{colsState}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center w-full gap-2">
				<p className="bg-amber-500 text-white font-semibold px-2 py-1 rounded-md">
					{points}
				</p>

				<p
					className={
						"font-semibold text-white flex-1 rounded-full bg-red-500/70 px-2 py-1 " +
						(gameOver
							? "opacity-100 scale-100"
							: "opacity-0 scale-0")
					}
				>
					GAME OVER!
				</p>

				{stopped ? (
					<>
						{!gameOver ? (
							<button
								onClick={resume}
								className="bg-green-600 font-semibold text-white p-2 rounded-md cursor-pointer"
							>
								<FaPlay />
							</button>
						) : null}

						<button
							onClick={restartHandler}
							className="bg-blue-400 font-semibold text-white p-2 rounded-md cursor-pointer"
						>
							<FaRedo />
						</button>
					</>
				) : (
					<button
						onClick={stop}
						className="bg-red-400 font-semibold text-white p-2 rounded-md cursor-pointer"
					>
						<FaStop />
					</button>
				)}
			</div>
		</header>
	);
};

export default Options;
