import { parseArgs } from './util/parse-args';

(async function main() {
  const [entries] = await parseArgs({ type: 'lines', lineParser: (line) => parseInt(line, 10) }) as [number[]];

  const array: boolean[] = [];

  for (const x of entries) {
    if (x > 2020) {
      continue;
    }
    const inverse = 2020 - x;
    if (array[inverse]) {
      console.log(`${x} * ${inverse} = ${x * inverse}`);
      process.exit(0);
      break;
    }
    array[x] = true;
  }

  console.log('Not found.');
  process.exit(1);
})()
