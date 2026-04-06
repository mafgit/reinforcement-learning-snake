import Game from "./game";
import QLearning from "./model";
import { getRandomGameStart } from "@/utils/game";
import fs from "fs";

const model = new QLearning();

const GAMES = 1200;
const MAX_STEPS = 1000;

console.log("Starting Training...");
console.log("Games:", GAMES);
console.log("Max Steps Per Game:", MAX_STEPS);

let collidedGames = 0;
for (let g = 0; g < GAMES; g++) {
	const params = getRandomGameStart();
	const game = new Game(params);

	for (let step = 0; step < MAX_STEPS; step++) {
		const { collided } = model.run(game);
		if (collided) {
			collidedGames++;
			break;
		}
	}
}

console.log("\n\nTraining Complete!\n\n");
console.log("Epsilon so far:", model.randomness);
console.log("Games collided in:", collidedGames);

fs.writeFileSync(
	"pretrained.json",
	JSON.stringify({
		learningRate: model.learningRate,
		Q: model.Q,
		discountFactor: model.discountFactor,
		randomness: model.randomness,
		decay: model.decay,
	}),
);
