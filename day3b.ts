import { parseArgs } from './util/parse-args';

(async function main() {
  const [rows, angles] = await parseArgs('lines', { type: 'lines', lineParser: (line) => {
    const [right, down] = line.split(/\s+/g);
    return [parseInt(right, 10), parseInt(down, 10)];
  }}) as [string[], [number, number][]];

  const hits = angles.map(([right, down]) => {
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

    return hit;
  });

  console.log(`Trees hit: ${hits.join(' * ')} = ${hits.reduce((acc, curr) => acc * curr, 1)}`);
  process.exit(0);
})()
