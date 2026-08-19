// Run with: bun utils/Times.test.ts
import assert from "node:assert";
import { monthName, monthYear } from "./Times";

// A semester starting in August used to render "January" at index 0.
assert.equal(monthName("Aug '26"), "August");
assert.equal(monthName("Jul'25"), "July");
assert.equal(monthName("January '26"), "January");
assert.equal(monthName(undefined), "");

// The year label used to come from calendar[calendar.length - 1], which threw
// on an empty calendar and showed the semester's last year while you were
// looking at an earlier month.
assert.equal(monthYear("Aug '26"), "2026");
assert.equal(monthYear("Jan '27"), "2027");
assert.equal(monthYear("Aug"), "");
assert.equal(monthYear(undefined), "");

console.info("Times: ok");
