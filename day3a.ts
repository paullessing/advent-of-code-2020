import { parseArgs } from './util/parse-args';

(async function main() {
  const [rows, right, down] = await parseArgs('lines', 'int', 'int') as [string[], number, number];

  let currentRow = 0;
  let currentCol = 0;

  let hit = 0;

  while (currentRow < rows.length) {
    const row = rows[currentRow];
    if (row[currentCol % row.length] === '#') {
      hit++;
    }

    currentRow += down;
    currentCol += right;
  }

  console.log(`Trees hit: ${hit}`);
  process.exit(0);
})()
