import Game from "./Game";

export enum Action {
	Continue = 0,
	Clockwise,
	Anticlockwise,
}

// Actions: Continue, Clockwise, Anticlockwise
// States: Direction Up, Right, Down, Left, Danger Ahead, Danger Clockwise, Danger Anticlockwise, Food Ahead, Food Clockwise, Food Behind, Food Anticlockwise

export default class QLearning {
	Q: [number, number, number][];
	actions: Action[];
	stateCount: number;

	learningRate: number;
	discountFactor: number; // future consideration / gamma
	greediness: number; // epsilon

	constructor() {
		this.Q = [];
		this.actions = [
			Action.Continue,
			Action.Clockwise,
			Action.Anticlockwise,
		];
		this.stateCount = 11;

		this.learningRate = 0.1;
		this.discountFactor = 0.1;
		this.greediness = 1;

		for (let i = 0; i < Math.pow(2, this.stateCount); i++) {
			this.Q[i] = [0, 0, 0];
		}

		// this.currentState = this.getDecimalKeyForState(initialState);
	}

	private getDecimalKeyForState(state: number[]): number {
		console.assert(state.length === this.stateCount);
		let stateKeyDecimal = 0;
		for (let i = 0; i < state.length; i++) {
			stateKeyDecimal += state[i] ? Math.pow(2, state.length - i - 1) : 0;
		}

		return stateKeyDecimal;
	}

	run(game: Game, currentState: number[]) {
		let action;
		const stateKeyDecimal = this.getDecimalKeyForState(currentState);

		if (Math.random() < this.greediness) {
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

		const newState = game.turnHeadDirection(action);
		const newStateKeyDecimal = this.getDecimalKeyForState(newState);
		// this.currentState = newState;

		this.updateQ(stateKeyDecimal, action, newStateKeyDecimal);

		return { action, newState };
	}

	private updateQ(s: number, a: number, newS: number) {
		let maxQForNewState = 0;
		for (const x of this.Q[newS]) {
			if (x > maxQForNewState) maxQForNewState = x;
		}

		this.Q[s][a] =
			this.Q[s][a] +
			this.learningRate *
				(this.discountFactor * maxQForNewState - this.Q[s][a]);
	}
}
