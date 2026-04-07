# Reinforcement Learning Snake

I used reinforcement learning (reward-based training) to train the snake to:

1. decide actions itself,
1. prioritize avoiding collisions (-30 reward),
1. prioritize eating food (+15 reward),
1. avoid wasting time (-1 reward for no eating).

### Demo

<video src="demo.mp4" width="100%" controls></video>

### Made using

- Next.js
- TypeScript
- Reinforcement learning & Bellman equation
- Tailwind
- memoization (to improve performance)
- modular production-level folder structure

### Issues

- Food location in giving game state to model logic for wraparound
- Snake should stop when eating
