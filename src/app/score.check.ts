import assert from "node:assert/strict"
import { levels, roundScore, timeBudget } from "./score.ts"

assert.deepEqual(levels.map(({ seconds }) => seconds), [0, 20, 10])
assert.equal(timeBudget(20, false), 20)
assert.equal(timeBudget(20, true), 140)
assert.equal(roundScore(100, 0, 0), 100)
assert.equal(roundScore(100, 20, 20), 150)
assert.equal(roundScore(100, 10, 20), 125)
assert.equal(roundScore(50, 10, 20), 63)
assert.equal(roundScore(100, -1, 20), 100)
assert.equal(roundScore(100, 30, 20), 150)

console.log("Skor mode bertimer valid")
