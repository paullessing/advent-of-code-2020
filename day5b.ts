import { parseArgs } from './util/parse-args';

function convertBinaryToNumeric(value: string): number {
  const binary = value.replace(/[BR]/gi, '1').replace(/[FL]/gi, '0');
  return parseInt(binary, 2);
}

(async function main() {
  const [lines] = await parseArgs({ type: 'lines', lineParser: convertBinaryToNumeric }) as [number[]];

  const allSeats = lines.sort((a, b) => a - b);

  for (let i = 0; i < allSeats.length; i++) {
    if (allSeats[i + 1] === allSeats[i] + 2) {
      console.log(`Found seat: ${allSeats[i] + 1}`);
      process.exit(0);
    }
  }
  console.log('Seat not found');
  process.exit(1);
})();
