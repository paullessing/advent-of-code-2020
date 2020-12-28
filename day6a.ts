import { parseArgs } from './util/parse-args';

(async function main() {
  const [lines] = await parseArgs({ type: 'lines', lineParser: (line) => line.trim().length ? line.split('') : null }) as [(string[] | null)[]];

  let total = 0;
  let currentSet = new Set();
  for (const line of lines) {
    if (!line) {
      total += currentSet.size;
      currentSet = new Set();
      continue;
    }

    for (const char of line) {
      currentSet.add(char);
    }
  }
  total += currentSet.size;

  console.log(`Total: ${total}`);
  process.exit(0);
})();
