"use client";
import GameComponent from "@/components/Game";
import { useState } from "react";

export default function Home() {
	const [autoMode, setAutoMode] = useState(true);
	const [gameOver, setGameOver] = useState(false);

	return (
		<div
			className={
				"flex flex-col items-center w-full py-16 px-2 min-h-screen transition-all duration-1000 " +
				(gameOver ? "bg-red-400" : autoMode ? "auto-mode-anim bg-purple-600" : "bg-green-400")
			}
		>
			<GameComponent
				autoMode={autoMode}
				setAutoMode={setAutoMode}
				gameOver={gameOver}
				setGameOver={setGameOver}
			/>
		</div>
	);
}
