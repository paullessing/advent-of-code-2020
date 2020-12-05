import { parseArgs } from './util/parse-args';

(async function main() {
  const [entries] = await parseArgs({ type: 'lines', lineParser: (line) => parseInt(line, 10) }) as [number[]];

  const array: [firstIndex: number, secondIndex: number][][] = [];

  // Compute the sum of all pairs of values, and store their indices in the map.
  // This is an O(n^2) operation.
  for (let i = 0; i < entries.length - 1; i++) {
    if (entries[i] > 2020) {
      continue;
    }
    for (let j = i + 1; j < entries.length; j++) {
      const sum = entries[i] + entries[j];
      if (sum > 2020) {
        continue;
      }
      array[sum] = array[sum] || [];
      array[sum].push([i, j]);
    }
  }

  // Compute the value that remains for each entry; if there is a map entry for it, check if it's not made using the same number twice.
  // This is a O(n^2) check, but realistically there should only be a small number of entries for this key in the map,
  // making it average-case O(n).
  // Either way, the total complexity for the `main` function is O(n^2).
  for (let i = 0; i < entries.length; i++) {
    const remainder = 2020 - entries[i];
    if (array[remainder]) {
      for (const [a, b] of array[remainder]) {
        if (a !== i && b !== i) {
          console.log(`${entries[i]} * ${entries[a]} * ${entries[b]} = ${entries[i] * entries[a] * entries[b]}`);
          process.exit(0);
          return;
        }
      }
    }
  }

  console.log('Not found.');
  process.exit(1);
})()
