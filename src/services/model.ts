import Game from "./game";

export enum Action {
	Continue = 0,
	Clockwise,
	Anticlockwise,
}

// Actions: Continue (straight ahead), Clockwise (right from current direction), Anticlockwise (left from current direction)
// States: [head direction of snake] [immediate danger relative based on action] [food location relative to head direction]
// States: [Direction Up, Right, Down, Left] [Danger Ahead, Clockwise, Anticlockwise] [Food Ahead, Clockwise, Food Behind, Food Anticlockwise]

export default class QLearning {
	Q: number[][];
	actions: Action[];
	stateCount: number;

	learningRate: number;
	discountFactor: number; // future consideration / gamma
	randomness: number; // epsilon
	decay: number;

	constructor(
		learningRate = 0.1,
		discountFactor = 0.85,
		initialRandomness = 1,
		decay = 0.98,
	) {
		this.actions = [
			Action.Continue,
			Action.Clockwise,
			Action.Anticlockwise,
		];
		this.stateCount = 11;

		this.Q = [];
		for (let i = 0; i < Math.pow(2, this.stateCount); i++) {
			this.Q[i] = [0, 0, 0];
		}

		this.learningRate = learningRate;
		this.discountFactor = discountFactor;
		this.randomness = initialRandomness;
		this.decay = decay;
	}

	async loadPretrained() {
		const pretrained = (await import("../../pretrained.json")).default

		const { Q, learningRate, discountFactor, randomness, decay } = pretrained

		this.Q = Q;
		this.learningRate = learningRate;
		this.discountFactor = discountFactor;
		this.randomness = randomness;
		this.decay = decay;
	}

	private getDecimalKeyForState(state: (number | boolean)[]): number {
		console.assert(state.length === this.stateCount);
		let stateKeyDecimal = 0;
		for (let i = 0; i < state.length; i++) {
			stateKeyDecimal += state[i] ? Math.pow(2, state.length - i - 1) : 0;
		}

		return stateKeyDecimal;
	}

	run(game: Game) {
		let action;
		const currentState = game.getCurrentState();
		const stateKeyDecimal = this.getDecimalKeyForState(currentState);

		if (Math.random() < this.randomness) {
			// explore (pick random)
			action =
				this.actions[Math.floor(Math.random() * this.actions.length)];
		} else {
			// exploit (pick based on learning)

			const actions = this.Q[stateKeyDecimal];
			let maxArg = 0;
			for (let i = 1; i < actions.length; i++) {
				if (actions[i] > actions[maxArg]) {
					maxArg = i;
				}
			}

			action = this.actions[maxArg];
		}

		const { updatedSnake, ateFood, collided, newFood, newDirection } =
			game.moveSnakeOneStep(action);

		let reward = 0;
		if (collided) reward = -30;
		else if (ateFood) reward = 15;
		else {
			reward = -1;
		}

		const newState = game.getCurrentState();
		const newStateKeyDecimal = this.getDecimalKeyForState(newState);
		// this.currentState = newState;

		this.updateQ(reward, stateKeyDecimal, action, newStateKeyDecimal);

		// if collided decrease epsilon for next game/episode
		if (collided) {
			this.decayEpsilon();
		}

		return { ateFood, collided, updatedSnake, newFood, newDirection };
	}

	private decayEpsilon() {
		this.randomness = Math.max(0.05, this.randomness * this.decay);
	}

	private updateQ(
		reward: number,
		state: number,
		action: number,
		newState: number,
	) {
		let maxQForNewState = this.Q[newState][0];
		for (let i = 1; i < this.Q[newState].length; i++) {
			const q = this.Q[newState][i];
			if (q > maxQForNewState) maxQForNewState = q;
		}

		this.Q[state][action] =
			this.Q[state][action] +
			this.learningRate *
				(reward +
					this.discountFactor * maxQForNewState -
					this.Q[state][action]);
	}
}
