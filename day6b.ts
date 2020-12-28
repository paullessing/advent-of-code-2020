import { parseArgs } from './util/parse-args';

(async function main() {
  const [lines] = await parseArgs({ type: 'lines', lineParser: (line) => line.trim().length ? line.split('') : null }) as [(string[] | null)[]];

  let total = 0;
  let currentSet: Set<string> | null = null;
  for (const line of lines) {
    if (!line) {
      total += currentSet && currentSet.size || 0;
      currentSet = null
      continue;
    }

    if (!currentSet) {
      currentSet = new Set(line);
    } else {
      currentSet = union(line, currentSet);
    }
  }
  total += currentSet && currentSet.size || 0;

  console.log(`Total: ${total}`);
})();

function union<T>(values: T[], set: Set<T>): Set<T> {
  const newSet = new Set<T>();
  for (const value of values) {
    if (set.has(value)) {
      newSet.add(value);
    }
  }
  return newSet;
}
