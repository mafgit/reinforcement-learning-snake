"use client";
import Grid from "@/components/Grid";
import { useState } from "react";

export default function Home() {
	const [autoMode, setAutoMode] = useState(true);
	const [gameOver, setGameOver] = useState(false);

	return (
		<div
			className={
				"flex justify-center py-4 px-2 min-h-screen transition-all duration-1000 " +
				(gameOver ? "bg-red-400" : autoMode ? "auto-mode-anim bg-purple-600" : "bg-green-400")
			}
		>
			<Grid
				autoMode={autoMode}
				setAutoMode={setAutoMode}
				gameOver={gameOver}
				setGameOver={setGameOver}
			/>
		</div>
	);
}
