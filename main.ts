// Seventeen Syllables of Debugging — a haiku about debugging.
// Writes the haiku to <output dir>/entry.txt and nothing else.
// Node 22 standard library only, no network, no dependencies.
//
// The haiku (hand-written, syllables counted word by word):
//   Line 1 (5): At(1) three(1) the(1) cursor(2)
//   Line 2 (7): blinks(1) where(1) the(1) last(1) log(1) line(1) ends(1)
//   Line 3 (5): the(1) bug(1) wore(1) my(1) name(1)

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The haiku, one line per array entry.
const HAIKU: string[] = [
  "At three, the cursor",
  "blinks where the last log line ends",
  "the bug wore my name",
];

// Hand-checked syllable count for every word, in line order.
// This is the source of truth for the self-check below.
const SYLLABLES: number[][] = [
  [1, 1, 1, 2], // At / three, / the / cursor
  [1, 1, 1, 1, 1, 1, 1], // blinks / where / the / last / log / line / ends
  [1, 1, 1, 1, 1], // the / bug / wore / my / name
];

const EXPECTED_PER_LINE = [5, 7, 5];
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Self-check: three lines, 5-7-5 syllables, 1-200 chars, not blank.
  if (HAIKU.length !== 3) fail(`expected 3 lines, got ${HAIKU.length}`);
  for (let i = 0; i < 3; i++) {
    const words = HAIKU[i].trim().split(/\s+/);
    if (words.length !== SYLLABLES[i].length) {
      fail(
        `line ${i + 1}: ${words.length} words but ${SYLLABLES[i].length} syllable entries`,
      );
    }
    const total = SYLLABLES[i].reduce((a, b) => a + b, 0);
    if (total !== EXPECTED_PER_LINE[i]) {
      fail(
        `line ${i + 1}: ${total} syllables, expected ${EXPECTED_PER_LINE[i]}`,
      );
    }
  }

  const text = HAIKU.join("\n");
  if (text.length < 1 || text.length > MAX_CHARS) {
    fail(`text is ${text.length} characters, expected 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) fail("text is only whitespace");

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  console.log(`wrote ${outPath} (${text.length} characters, 17 syllables)`);
}

main();
