// Run with: bun utils/Times.test.ts
import assert from "node:assert";
import { monthName } from "./Times";

// A semester starting in August used to render "January" at index 0.
assert.equal(monthName("Aug '26"), "August");
assert.equal(monthName("Jul'25"), "July");
assert.equal(monthName("January '26"), "January");
assert.equal(monthName(undefined), "");

console.info("Times: ok");
